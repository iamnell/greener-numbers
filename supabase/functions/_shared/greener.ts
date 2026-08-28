import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const SITE = "greenernumbers";
const url = Deno.env.get("SUPABASE_URL")!;
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
export const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

export function cors() { return { "content-type": "application/json", "cache-control": "no-store" }; }
export function authorized(req: Request) { return Boolean(Deno.env.get("GREENER_CRON_SECRET")) && req.headers.get("x-greener-cron-secret") === Deno.env.get("GREENER_CRON_SECRET"); }
export async function sha(value: string) { const bytes = new TextEncoder().encode(value); const hash = await crypto.subtle.digest("SHA-256", bytes); return [...new Uint8Array(hash)].map((x) => x.toString(16).padStart(2, "0")).join(""); }
export function slug(value: string) { return value.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 110); }
export function topic(value: string) { const v = value.toLowerCase(); if (/electric|utility|grid|natural gas|gasoline|fuel oil|energy price/.test(v)) return "energy-costs"; if (/electric vehicle|ev |charging|alternative fuel/.test(v)) return "ev"; if (/tax credit|rebate|incentive|heat pump|weatherization|energy star/.test(v)) return "incentives"; return "energy-economics"; }
export function score(title: string, summary: string) { const text = `${title} ${summary}`.toLowerCase(); let n = 15; for (const term of ["price", "cost", "bill", "rate", "saving", "rebate", "tax credit", "electric vehicle", "charging", "heat pump", "electricity", "gasoline", "natural gas"]) if (text.includes(term)) n += 7; return Math.min(n, 100); }
export async function runStart(job_name: string) { const { data, error } = await db.from("cron_runs").insert({ site: SITE, job_name }).select("id").single(); if (error) throw error; return data.id as string; }
export async function runEnd(id: string, status: "success" | "partial" | "failed" | "skipped", counters: Record<string, number> = {}, error?: unknown, metadata: Record<string, unknown> = {}) { await db.from("cron_runs").update({ completed_at: new Date().toISOString(), status, items_found: counters.found ?? 0, items_created: counters.created ?? 0, items_updated: counters.updated ?? 0, items_skipped: counters.skipped ?? 0, error_message: error instanceof Error ? error.message.slice(0, 2000) : error ? String(error).slice(0, 2000) : null, metadata }).eq("id", id); }
export function response(value: unknown, status = 200) { return new Response(JSON.stringify(value), { status, headers: cors() }); }
export function requireCron(req: Request) { if (!authorized(req)) return response({ error: "unauthorized" }, 401); }
export function dateOnly(value: string) { const d = new Date(value); return Number.isNaN(d.valueOf()) ? null : d.toISOString().slice(0, 10); }
export function plain(value: string) { return value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim(); }
export function rssItems(xml: string) { return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => { const block = m[1]; const field = (name: string) => plain((block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, "i"))?.[1] ?? "")); const link = field("link") || (block.match(/<link[^>]+href=["']([^"']+)/i)?.[1] ?? ""); return { title: field("title"), url: link, id: field("guid") || link, summary: field("description"), published: field("pubDate") || field("published") }; }).filter((x) => x.title && x.url.startsWith("https://")); }

export async function ingestEia() {
  const sourceUrl = "https://www.eia.gov/rss/todayinenergy.xml";
  const res = await fetch(sourceUrl, { signal: AbortSignal.timeout(12_000), headers: { "user-agent": "GreenerNumbers data bot (+https://greenernumbers.com/sources)" } });
  if (!res.ok) throw new Error(`EIA_RSS_${res.status}`);
  const rows = rssItems(await res.text()); let created = 0, skipped = 0;
  for (const row of rows.slice(0, 50)) {
    const content_hash = await sha(`${row.url}|${row.title}`); const relevance_score = score(row.title, row.summary);
    const { data, error } = await db.from("source_items").upsert({ site: SITE, source_name: "U.S. Energy Information Administration", source_url: sourceUrl, canonical_url: row.url, source_item_id: row.id, title: row.title, summary: row.summary || null, raw_text: row.summary || null, source_published_at: new Date(row.published).toISOString(), topic: topic(`${row.title} ${row.summary}`), relevance_score, breaking_candidate: relevance_score >= 65, content_hash, metadata: { feed: sourceUrl } }, { onConflict: "site,canonical_url", ignoreDuplicates: true }).select("id");
    if (error) throw error; // uniqueness turns re-runs into harmless skips
    if (data?.length) created++; else skipped++;
  }
  return { found: rows.length, created, skipped };
}

export async function publishFromCandidate(job: string, breakingOnly = false) {
  const { data: candidates, error } = await db.from("source_items").select("*").eq("site", SITE).eq("processed", false).order("relevance_score", { ascending: false }).order("source_published_at", { ascending: false }).limit(20);
  if (error) throw error;
  const candidate = (candidates ?? []).find((x) => !breakingOnly || x.breaking_candidate && Number(x.relevance_score) >= 70);
  if (!candidate) return { published: false, reason: "no-qualifying-candidate" };
  const body = articleBody(candidate);
  if (body.length < 600 || !candidate.source_url || !candidate.title) return { published: false, reason: "validation-failed" };
  const content_hash = await sha(`${candidate.canonical_url}|${body}`); const articleSlug = `${slug(candidate.title)}-${new Date(candidate.source_published_at ?? Date.now()).toISOString().slice(0, 10)}`.slice(0, 120);
  const story_type = breakingOnly ? "breaking" : "daily";
  const record = { site: SITE, title: candidate.title, slug: articleSlug, summary: candidate.summary || `A source-backed update from ${candidate.source_name}.`, content: body, story_type, category: candidate.topic || "energy-economics", status: "published", is_breaking: breakingOnly, breaking_score: breakingOnly ? candidate.relevance_score : null, source_url: candidate.canonical_url, source_name: candidate.source_name, source_release_id: candidate.source_item_id, source_published_at: candidate.source_published_at, content_hash, generated_by_job: job, first_published_at: new Date().toISOString(), published_at: new Date().toISOString(), last_updated_at: new Date().toISOString() };
  const { error: publishError } = await db.from("site_news").upsert(record, { onConflict: "site,source_name,source_release_id", ignoreDuplicates: true }); if (publishError) throw publishError;
  await db.from("source_items").update({ processed: true }).eq("id", candidate.id);
  return { published: true, slug: articleSlug };
}
function articleBody(item: Record<string, unknown>) {
  const title = String(item.title); const summary = String(item.summary || "The release should be read alongside the primary source."); const source = String(item.source_name); const url = String(item.canonical_url); const category = String(item.topic || "energy economics");
  return `${title}\n\nWhat happened\n\n${summary}\n\nWhy it matters for household costs\n\nThis update is relevant to ${category.replace(/-/g, " ")} because household decisions about energy, transportation, and home equipment depend on current, source-backed information. The release itself is the factual basis for this article; Greener Numbers does not treat it as a prediction of an individual bill, rebate, or tax outcome.\n\nWhat the source establishes\n\n${source} published the underlying release at ${url}. Readers should use the release for definitions, reporting period, geography, and any limitations that apply to the dataset or announcement. A national average, program announcement, or infrastructure measure is not automatically a local utility tariff, an available incentive, or a guaranteed savings result.\n\nPractical household takeaway\n\nUse this item as a prompt to check the inputs that actually affect your decision: your utility bill and rate plan, driving or home-energy use, equipment quote, location, and the official program terms. For EV questions, compare charging cost and gasoline cost with editable assumptions. For home upgrades, keep estimates separate from eligibility and contractor pricing.\n\nMethod and limits\n\nThis is a source-grounded daily update generated from an official release. It does not add unverified dollar amounts, eligibility rules, quotes, dates, or forecasts. Any calculation should show its formula, units, period, geography, and source inputs. If the official source is later corrected or materially updated, this article should be updated rather than duplicated.\n\nSource\n\nPrimary source: ${source}, ${url}. Accessed ${new Date().toISOString().slice(0, 10)}.\n\nRelated tools\n\nExplore the EV Charging Cost Calculator, EV vs. Gas Calculator, Electricity Bill Calculator, and incentives directory on GreenerNumbers.com. Inputs in calculators remain user-editable and source values, when shown, are defaults rather than personal tariffs.`;
}

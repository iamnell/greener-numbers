import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE = "greenernumbers";
const MODEL = "gemini-3.6-flash";
const response = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const text = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const urls = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => text(item) && /^https:\/\//.test(item.trim())).map((item) => item.trim()) : [];

type Brief = { edition_date: string; sync_key: string; title: string; summary: string; content: string; category: string; source_urls: string[] };
type Editorial = { passed: boolean; score: number; notes: string[]; title: string; summary: string; content: string; category: string };

function parseBrief(value: unknown): Brief | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>, source_urls = urls(row.source_urls);
  if (!["edition_date", "sync_key", "title", "summary", "content", "category"].every((key) => text(row[key])) || !/^\d{4}-\d{2}-\d{2}$/.test(row.edition_date as string) || source_urls.length === 0 || (row.content as string).trim().length < 800) return null;
  return { edition_date: (row.edition_date as string).trim(), sync_key: (row.sync_key as string).trim(), title: (row.title as string).trim(), summary: (row.summary as string).trim(), content: (row.content as string).trim(), category: (row.category as string).trim(), source_urls };
}

async function qc(brief: Brief): Promise<Editorial> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("Gemini QC is not configured");
  const schema = { type: "object", properties: { passed: { type: "boolean" }, score: { type: "integer" }, notes: { type: "array", items: { type: "string" } }, title: { type: "string" }, summary: { type: "string" }, content: { type: "string" }, category: { type: "string" } }, required: ["passed", "score", "notes", "title", "summary", "content", "category"], additionalProperties: false };
  const prompt = `You are the Greener Numbers editorial QC desk. Review this consumer energy and sustainable-finance daily brief against its supplied primary-source URLs. Return passed=false if it lacks source support, invents facts, treats estimates as guarantees, provides individualized financial, tax, or legal advice, has unclear numerical claims, or contains a material contradiction. If it can pass, make only necessary factual-clarity edits. Preserve the brief's original meaning and do not invent facts, sources, figures, or dates. A passing score requires 80 or above.\n\nSOURCES:\n${brief.source_urls.join("\n")}\n\nBRIEF:\nTitle: ${brief.title}\nSummary: ${brief.summary}\nCategory: ${brief.category}\n\n${brief.content}`;
  const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, { method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": apiKey }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1, responseMimeType: "application/json", responseJsonSchema: schema } }) });
  if (!apiResponse.ok) throw new Error(`Gemini QC request failed (${apiResponse.status})`);
  const body = await apiResponse.json();
  const raw = body?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("");
  let result: Editorial;
  try { result = JSON.parse(raw); } catch { throw new Error("Gemini QC returned invalid JSON"); }
  if (!result.passed || !text(result.title) || !text(result.summary) || !text(result.content) || !text(result.category) || result.content.trim().length < 800 || !Number.isInteger(result.score) || result.score < 80) throw new Error("Gemini QC rejected this brief");
  return result;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return response({ success: false, error: "Method not allowed" }, 405);
  const secret = Deno.env.get("GEMINI_BRIEF_INGEST_SECRET");
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return response({ success: false, error: "Unauthorized" }, 401);
  let payload: unknown;
  try { payload = await request.json(); } catch { return response({ success: false, error: "Invalid JSON" }, 400); }
  const brief = parseBrief(payload);
  if (!brief) return response({ success: false, error: "Invalid brief payload" }, 422);
  const url = Deno.env.get("SUPABASE_URL"), key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return response({ success: false, error: "Database configuration is unavailable" }, 500);
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  let editorial: Editorial;
  try { editorial = await qc(brief); }
  catch (error) { const message = error instanceof Error ? error.message : "Gemini QC failed"; await db.from("gemini_brief_qc_runs").insert({ site: SITE, sync_key: brief.sync_key, status: message.includes("rejected") ? "rejected" : "error", notes: [message] }); return response({ success: false, error: "Brief did not pass editorial QC" }, 422); }
  const now = new Date().toISOString(), slug = `${brief.sync_key}-${brief.edition_date}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 120);
  const { data, error } = await db.from("site_news").upsert({ site: SITE, sync_key: brief.sync_key, title: editorial.title.trim(), slug, summary: editorial.summary.trim(), content: editorial.content.trim(), category: editorial.category.trim(), story_type: "daily", status: "published", is_breaking: false, source_url: brief.source_urls[0], source_urls: brief.source_urls, source_name: "Gemini Scheduled Task", source_release_id: brief.sync_key, content_hash: await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${brief.sync_key}|${editorial.content}`)).then((hash) => [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("")), generated_by_job: "publish-gemini-brief", first_published_at: now, published_at: now, last_updated_at: now, qc_status: "passed", qc_score: editorial.score, qc_notes: editorial.notes, editorial_model: MODEL, reviewed_at: now, original_title: brief.title, original_content: brief.content }, { onConflict: "sync_key" }).select("id, slug").single();
  if (error || !data) { console.error(error); return response({ success: false, error: "Brief could not be saved" }, 500); }
  await db.from("gemini_brief_qc_runs").insert({ site: SITE, sync_key: brief.sync_key, status: "passed", score: editorial.score, notes: editorial.notes });
  return response({ success: true, id: data.id, slug: data.slug, qc_score: editorial.score });
});

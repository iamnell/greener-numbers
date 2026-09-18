import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE = "greenernumbers";
const MODEL = "gemini-3.6-flash";
const CATEGORIES = ["energy-costs", "ev", "incentives", "energy-economics"] as const;
type Category = typeof CATEGORIES[number];
type Draft = { category: Category; title: string; summary: string; content: string; source_urls: string[] };
type Review = { passed: boolean; score: number; notes: string[]; title: string; summary: string; content: string; category: Category };
const reply = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const validUrl = (value: string) => { try { return new URL(value).protocol === "https:"; } catch { return false; } };

async function sha(value: string) {
  const bytes = new TextEncoder().encode(value);
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
function slot(date = new Date()) {
  const hour = date.getUTCHours() - (date.getUTCHours() % 2);
  return String(date.getUTCFullYear()) + String(date.getUTCMonth() + 1).padStart(2, "0") + String(date.getUTCDate()).padStart(2, "0") + "-" + String(hour).padStart(2, "0");
}
async function gemini<T>(apiKey: string, prompt: string, schema: Record<string, unknown>): Promise<T> {
  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent", { method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": apiKey }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], tools: [{ googleSearch: {} }], generationConfig: { temperature: 0.2, responseMimeType: "application/json", responseJsonSchema: schema } }) });
  if (!response.ok) throw new Error("Gemini request failed (" + response.status + "): " + (await response.text()).slice(0, 400));
  const payload = await response.json(), raw = payload?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text ?? "").join("");
  if (!raw) throw new Error("Gemini returned no editorial output");
  return JSON.parse(raw) as T;
}
async function createDraft(apiKey: string): Promise<Draft> {
  const schema = { type: "object", properties: { category: { type: "string", enum: [...CATEGORIES] }, title: { type: "string" }, summary: { type: "string" }, content: { type: "string" }, source_urls: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 } }, required: ["category", "title", "summary", "content", "source_urls"], additionalProperties: false };
  const prompt = "You are the Greener Numbers editorial desk. Use Google Search grounding to find one timely, material U.S. development affecting household energy costs, electric vehicles, home electrification, clean-energy incentives, or sustainable consumer finance. This is a recurring two-hour brief: choose a meaningful current development, not a generic explainer, market commentary, financial advice, or an invented claim. No one source or agency is a required trigger. Prefer direct primary or authoritative HTTPS sources, such as official agencies, utilities, regulators, program administrators, or original company releases. Return 2-5 direct source URLs that substantively support the story; do not fabricate URLs. Write a clear title, one-paragraph summary, and a careful body of at least 800 characters. Do not make personal savings, tax, legal, eligibility, or bill guarantees. Return JSON only.";
  const draft = await gemini<Draft>(apiKey, prompt, schema);
  if (!CATEGORIES.includes(draft.category) || !draft.title?.trim() || !draft.summary?.trim() || !draft.content?.trim() || draft.content.trim().length < 800 || !Array.isArray(draft.source_urls)) throw new Error("Gemini draft did not meet editorial requirements");
  const sourceUrls = [...new Set(draft.source_urls.map((value) => value.trim()).filter(validUrl))];
  if (sourceUrls.length < 2) throw new Error("Gemini draft did not provide two valid HTTPS sources");
  return { ...draft, title: draft.title.trim(), summary: draft.summary.trim(), content: draft.content.trim(), source_urls: sourceUrls };
}
async function reviewDraft(apiKey: string, draft: Draft): Promise<Review> {
  const schema = { type: "object", properties: { passed: { type: "boolean" }, score: { type: "integer" }, notes: { type: "array", items: { type: "string" } }, title: { type: "string" }, summary: { type: "string" }, content: { type: "string" }, category: { type: "string", enum: [...CATEGORIES] } }, required: ["passed", "score", "notes", "title", "summary", "content", "category"], additionalProperties: false };
  const prompt = "Act as an independent editor for Greener Numbers. Use Google Search grounding to cross-check the supplied URLs. Approve only if the brief is materially supported, precise, neutral, and contains no individualized financial, tax, legal, eligibility, utility-bill, or savings guarantees. Its body must be at least 800 characters. You may correct wording, but do not add unsupported facts. Return passed=false and explain why if the sources do not support publication.\n\nCATEGORY: " + draft.category + "\nTITLE: " + draft.title + "\nSUMMARY: " + draft.summary + "\nBODY:\n" + draft.content + "\n\nSOURCE URLS:\n" + draft.source_urls.map((value) => "- " + value).join("\n");
  const review = await gemini<Review>(apiKey, prompt, schema);
  if (!review.passed || !Number.isInteger(review.score) || review.score < 80 || !CATEGORIES.includes(review.category) || !review.title?.trim() || !review.summary?.trim() || !review.content?.trim() || review.content.trim().length < 800) throw new Error("Gemini editorial QC rejected the brief" + (review.notes?.length ? ": " + review.notes.join("; ") : ""));
  return { ...review, title: review.title.trim(), summary: review.summary.trim(), content: review.content.trim(), notes: Array.isArray(review.notes) ? review.notes : [] };
}
Deno.serve(async (request) => {
  if (request.method !== "POST") return reply({ success: false, error: "Method not allowed" }, 405);
  const cronSecret = Deno.env.get("GREENER_CRON_SECRET"), apiKey = Deno.env.get("GEMINI_API_KEY"), url = Deno.env.get("SUPABASE_URL"), key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!cronSecret || request.headers.get("x-greener-cron-secret") !== cronSecret) return reply({ success: false, error: "Unauthorized" }, 401);
  if (!apiKey || !url || !key) return reply({ success: false, error: "Server configuration is unavailable" }, 500);
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }), syncKey = "gemini-greener-" + slot();
  try {
    const { data: existing, error: existingError } = await db.from("site_news").select("slug").eq("sync_key", syncKey).eq("status", "published").maybeSingle();
    if (existingError) throw existingError;
    if (existing) return reply({ success: true, skipped: true, sync_key: syncKey, slug: existing.slug });
    const draft = await createDraft(apiKey), review = await reviewDraft(apiKey, draft), now = new Date().toISOString(), slug = (syncKey + "-" + draft.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 120), contentHash = await sha(syncKey + "|" + review.content);
    const { data: story, error: storyError } = await db.from("site_news").upsert({ site: SITE, sync_key: syncKey, title: review.title, slug, summary: review.summary, content: review.content, category: review.category, story_type: "daily", status: "published", is_breaking: false, source_url: draft.source_urls[0], source_urls: draft.source_urls, source_name: "Gemini Scheduled Brief", source_release_id: syncKey, content_hash: contentHash, generated_by_job: "scheduled-greener-brief", first_published_at: now, published_at: now, last_updated_at: now, qc_status: "passed", qc_score: review.score, qc_notes: review.notes, editorial_model: MODEL, reviewed_at: now, original_title: draft.title, original_content: draft.content }, { onConflict: "sync_key" }).select("id, slug").single();
    if (storyError || !story) throw storyError ?? new Error("Brief save failed");
    await db.from("gemini_brief_qc_runs").insert({ site: SITE, sync_key: syncKey, status: "passed", score: review.score, notes: review.notes });
    return reply({ success: true, sync_key: syncKey, slug: story.slug, qc_score: review.score, source_count: draft.source_urls.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : (() => { try { return JSON.stringify(error); } catch { return String(error); } })();
    await db.from("gemini_brief_qc_runs").insert({ site: SITE, sync_key: syncKey, status: "error", notes: [message] });
    return reply({ success: false, sync_key: syncKey, error: message }, 500);
  }
});

import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const BRAND = "Greener Numbers";

const isText = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const sourceUrls = (value: unknown) => Array.isArray(value)
  ? value.filter((item): item is string => isText(item) && /^https:\/\//.test(item.trim())).map((item) => item.trim())
  : [];

function authorized(request: NextRequest) {
  const secret = process.env.BRIEF_PUBLISH_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
  const documentId = payload?.metadata && typeof payload.metadata === "object" ? (payload.metadata as Record<string, unknown>).drive_file_id : null;
  const content = String(payload?.content || payload?.body || "").trim();
  const sources = sourceUrls(payload?.source_urls);
  if (!payload || payload.brand !== BRAND || !isText(payload.title) || !isText(payload.summary) || !isText(payload.category) || !content || !isText(documentId) || sources.length === 0) {
    return NextResponse.json({ error: "invalid brief payload" }, { status: 400 });
  }

  const publishedAt = new Date(isText(payload.published_at) ? payload.published_at : Date.now());
  if (Number.isNaN(publishedAt.valueOf())) return NextResponse.json({ error: "invalid published_at" }, { status: 400 });
  const syncKey = `drive:${documentId}`;
  const db = createServerClient();
  const record = {
    site: "greenernumbers", sync_key: syncKey, title: payload.title.trim(),
    slug: slug(String(payload.slug || `${BRAND}-${documentId}`)), summary: payload.summary.trim(), content,
    category: payload.category.trim(), story_type: "daily", status: "published", is_breaking: false,
    source_url: sources[0], source_urls: sources, source_name: "Gemini Daily Brief Bridge",
    source_release_id: syncKey, generated_by_job: "daily-brief-bridge",
    content_hash: createHash("sha256").update(`${syncKey}|${content}`).digest("hex"),
    first_published_at: publishedAt.toISOString(), published_at: publishedAt.toISOString(), last_updated_at: new Date().toISOString(),
    qc_status: "passed", qc_score: 100, qc_notes: ["Validated bridge payload"], editorial_model: "gemini-google-doc",
    reviewed_at: new Date().toISOString(), original_title: payload.title.trim(), original_content: content,
  };
  const { data, error } = await db.from("site_news").upsert(record, { onConflict: "sync_key" }).select("id,slug").single();
  if (error || !data) return NextResponse.json({ error: "brief could not be saved" }, { status: 500 });
  return NextResponse.json({ ok: true, ...data }, { status: 201 });
}

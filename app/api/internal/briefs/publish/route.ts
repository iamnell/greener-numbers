import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { database } from "@/lib/db";

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
  const db = database();
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
  try {
    const { rows } = await db.query(`insert into site_news (site,sync_key,title,slug,summary,content,category,story_type,status,is_breaking,source_url,source_urls,source_name,source_release_id,generated_by_job,content_hash,first_published_at,published_at,last_updated_at,qc_status,qc_score,qc_notes,editorial_model,reviewed_at,original_title,original_content)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22::jsonb,$23,$24,$25,$26)
      on conflict (sync_key) do update set title=excluded.title,slug=excluded.slug,summary=excluded.summary,content=excluded.content,category=excluded.category,source_url=excluded.source_url,source_urls=excluded.source_urls,content_hash=excluded.content_hash,last_updated_at=excluded.last_updated_at,qc_status=excluded.qc_status,qc_score=excluded.qc_score,qc_notes=excluded.qc_notes,reviewed_at=excluded.reviewed_at,original_title=excluded.original_title,original_content=excluded.original_content
      returning id,slug`, [record.site,record.sync_key,record.title,record.slug,record.summary,record.content,record.category,record.story_type,record.status,record.is_breaking,record.source_url,JSON.stringify(record.source_urls),record.source_name,record.source_release_id,record.generated_by_job,record.content_hash,record.first_published_at,record.published_at,record.last_updated_at,record.qc_status,record.qc_score,JSON.stringify(record.qc_notes),record.editorial_model,record.reviewed_at,record.original_title,record.original_content]);
    return NextResponse.json({ ok: true, ...rows[0] }, { status: 201 });
  } catch { return NextResponse.json({ error: "brief could not be saved" }, { status: 500 }); }
}

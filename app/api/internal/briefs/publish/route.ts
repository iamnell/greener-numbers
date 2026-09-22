import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { database } from "@/lib/db";
import { validateBriefPayload, type BriefPayload } from "@/lib/briefs/validation";

export const runtime = "nodejs";

function authorized(request: NextRequest) {
  const secret = process.env.BRIEF_PUBLISH_SECRET;
  return Boolean(secret && request.headers.get("authorization") === `Bearer ${secret}`);
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const validation = validateBriefPayload(await request.json().catch(() => null) as BriefPayload | null);
  if (!validation.ok) return NextResponse.json({ error: "invalid brief payload", details: validation.errors }, { status: 400 });

  const brief = validation.value;
  const syncKey = `drive:${brief.documentId}`;
  const now = new Date().toISOString();
  const record = {
    site: "greenernumbers", sync_key: syncKey, title: brief.title,
    slug: slug(brief.slug || `Greener Numbers-${brief.documentId}`), summary: brief.summary, content: brief.content,
    category: brief.category, story_type: "daily", status: brief.publish ? "published" : "draft", is_breaking: false,
    source_url: brief.sources[0], source_urls: brief.sources, source_name: "Gemini Daily Brief Bridge",
    source_release_id: syncKey, generated_by_job: "daily-brief-bridge",
    content_hash: createHash("sha256").update(`${syncKey}|${brief.content}`).digest("hex"),
    first_published_at: brief.publish ? brief.publishedAt.toISOString() : null,
    published_at: brief.publish ? brief.publishedAt.toISOString() : null,
    last_updated_at: now, qc_status: brief.publish ? "passed" : "pending", qc_score: brief.publish ? 100 : 0,
    qc_notes: brief.publish ? brief.qcNotes : ["Quarantined by daily brief bridge pending review"],
    editorial_model: "gemini-google-doc", reviewed_at: brief.publish ? now : null,
    original_title: brief.title, original_content: brief.content,
  };
  try {
    const db = database();
    const { rows } = await db.query(`insert into site_news (site,sync_key,title,slug,summary,content,category,story_type,status,is_breaking,source_url,source_urls,source_name,source_release_id,generated_by_job,content_hash,first_published_at,published_at,last_updated_at,qc_status,qc_score,qc_notes,editorial_model,reviewed_at,original_title,original_content)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22::jsonb,$23,$24,$25,$26)
      on conflict (sync_key) do update set title=excluded.title,slug=excluded.slug,summary=excluded.summary,content=excluded.content,category=excluded.category,status=excluded.status,source_url=excluded.source_url,source_urls=excluded.source_urls,content_hash=excluded.content_hash,published_at=excluded.published_at,last_updated_at=excluded.last_updated_at,qc_status=excluded.qc_status,qc_score=excluded.qc_score,qc_notes=excluded.qc_notes,reviewed_at=excluded.reviewed_at,original_title=excluded.original_title,original_content=excluded.original_content
      returning id,slug,status,qc_status`, [record.site,record.sync_key,record.title,record.slug,record.summary,record.content,record.category,record.story_type,record.status,record.is_breaking,record.source_url,JSON.stringify(record.source_urls),record.source_name,record.source_release_id,record.generated_by_job,record.content_hash,record.first_published_at,record.published_at,record.last_updated_at,record.qc_status,record.qc_score,JSON.stringify(record.qc_notes),record.editorial_model,record.reviewed_at,record.original_title,record.original_content]);
    return NextResponse.json({ ok: true, publication_state: brief.publish ? "published" : "quarantine", ...rows[0] }, { status: 201 });
  } catch { return NextResponse.json({ error: "brief could not be saved" }, { status: 500 }); }
}

export async function DELETE(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
  const documentId = typeof payload?.drive_file_id === "string" ? payload.drive_file_id.trim() : "";
  const expectedSlug = typeof payload?.expected_slug === "string" ? payload.expected_slug.trim() : "";
  const reason = typeof payload?.reason === "string" ? payload.reason.trim() : "";
  if (!/^[A-Za-z0-9_-]{10,}$/.test(documentId) || !expectedSlug || reason.length < 10) {
    return NextResponse.json({ error: "drive_file_id, expected_slug, and a reason of at least 10 characters are required" }, { status: 400 });
  }
  try {
    const db = database();
    const { rows } = await db.query(`update site_news set status='draft',qc_status='failed',qc_score=0,qc_notes=$3::jsonb,published_at=null,last_updated_at=$4 where sync_key=$1 and slug=$2 and status='published' returning id,slug,status,qc_status`, [`drive:${documentId}`, expectedSlug, JSON.stringify([`Unpublished: ${reason}`]), new Date().toISOString()]);
    if (!rows[0]) return NextResponse.json({ error: "published brief not found or identity mismatch" }, { status: 404 });
    return NextResponse.json({ ok: true, ...rows[0] });
  } catch { return NextResponse.json({ error: "brief could not be unpublished" }, { status: 500 }); }
}

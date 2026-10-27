export type BriefPayload = {
  brand?: unknown;
  title?: unknown;
  summary?: unknown;
  category?: unknown;
  content?: unknown;
  body?: unknown;
  slug?: unknown;
  published_at?: unknown;
  source_urls?: unknown;
  publication_state?: unknown;
  metadata?: unknown;
  qc?: unknown;
};

export type ValidatedBrief = {
  title: string;
  summary: string;
  category: string;
  content: string;
  slug?: string;
  publishedAt: Date;
  sources: string[];
  documentId: string;
  folderId: string;
  publish: boolean;
  qcNotes: string[];
  reviewedBy?: string;
};

const EXPECTED_BRAND = "Greener Numbers";
export const EXPECTED_FOLDER_ID = "168w7pIZjNZyTOArAKNXbfcNJ4DBjrgsN";
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";

export function validateBriefPayload(payload: BriefPayload | null):
  | { ok: true; value: ValidatedBrief }
  | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!payload || typeof payload !== "object") return { ok: false, errors: ["payload must be an object"] };

  const title = text(payload.title);
  const summary = text(payload.summary);
  const category = text(payload.category);
  const content = text(payload.content) || text(payload.body);
  const metadata = payload.metadata && typeof payload.metadata === "object" ? payload.metadata as Record<string, unknown> : {};
  const documentId = text(metadata.drive_file_id);
  const folderId = text(metadata.source_folder_id);
  const rawSources = Array.isArray(payload.source_urls) ? payload.source_urls : [];
  const sources = [...new Set(rawSources.map(text).filter(Boolean))];

  if (payload.brand !== EXPECTED_BRAND) errors.push(`brand must be ${EXPECTED_BRAND}`);
  if (title.length < 8 || title.length > 240) errors.push("title must be 8-240 characters");
  if (summary.length < 20 || summary.length > 1200) errors.push("summary must be 20-1200 characters");
  if (category.length < 2 || category.length > 80) errors.push("category must be 2-80 characters");
  if (content.length < 120) errors.push("content must be at least 120 characters");
  if (!/^[A-Za-z0-9_-]{10,}$/.test(documentId)) errors.push("metadata.drive_file_id is invalid");
  if (folderId !== EXPECTED_FOLDER_ID) errors.push("metadata.source_folder_id is not the Greener Numbers incoming folder");
  if (!sources.length) errors.push("at least one source URL is required");
  if (sources.some((url) => { try { return new URL(url).protocol !== "https:"; } catch { return true; } })) errors.push("all source URLs must be valid HTTPS URLs");

  const publishedAt = new Date(text(payload.published_at) || Date.now());
  if (Number.isNaN(publishedAt.valueOf())) errors.push("published_at is invalid");

  const requestedState = text(payload.publication_state) || "quarantine";
  if (!["quarantine", "published"].includes(requestedState)) errors.push("publication_state must be quarantine or published");
  const qc = payload.qc && typeof payload.qc === "object" ? payload.qc as Record<string, unknown> : {};
  const qcStatus = text(qc.status);
  const reviewedBy = text(qc.reviewed_by);
  const qcNotes = Array.isArray(qc.notes) ? qc.notes.map(text).filter(Boolean) : [];
  if (requestedState === "published" && (qcStatus !== "passed" || reviewedBy.length < 3 || qcNotes.length === 0)) {
    errors.push("published briefs require qc.status=passed, qc.reviewed_by, and qc.notes");
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, value: {
    title, summary, category, content, slug: text(payload.slug) || undefined,
    publishedAt, sources, documentId, folderId, publish: requestedState === "published",
    qcNotes, reviewedBy: reviewedBy || undefined,
  } };
}

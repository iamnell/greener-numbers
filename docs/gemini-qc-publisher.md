# Gemini QC publisher

The live publishing endpoint is:

`https://fatcsshvtazwgpxhmjpe.supabase.co/functions/v1/publish-gemini-brief`

Set these Edge Function secrets in the Greener Numbers Supabase project:

- `GEMINI_API_KEY`
- `GEMINI_BRIEF_INGEST_SECRET` — a new high-entropy value shared only with the scheduler

The Gemini scheduled task (or its Google Apps Script bridge) must `POST` JSON with an `Authorization: Bearer <GEMINI_BRIEF_INGEST_SECRET>` header:

```json
{
  "edition_date": "2026-09-06",
  "sync_key": "greener-daily-2026-09-06",
  "title": "…",
  "summary": "…",
  "content": "At least 800 characters of source-backed Markdown…",
  "category": "energy-economics",
  "source_urls": ["https://primary-source.example/release"]
}
```

The endpoint independently calls Gemini for editorial QC. It only publishes when the QC response passes with a score of 80 or higher. Every attempt is logged in `gemini_brief_qc_runs`; failed content is not published. Replaying the same `sync_key` updates the matching published record instead of creating a duplicate.

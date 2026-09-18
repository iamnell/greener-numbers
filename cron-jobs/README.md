# Greener Numbers — Cron Jobs (Railway)

Node.js cron job replacements for the original Supabase Deno edge functions. These scripts run as **Railway scheduled tasks** using plain Node.js + `node-fetch` (built-in `fetch`) and the Supabase JS client to talk directly to PostgreSQL via `DATABASE_URL`.

---

## Setup in Railway

### 1. Install dependencies

```bash
cd cron-jobs/
npm install
```

Commit the resulting `package-lock.json` or let Railway lock-build on deploy.

### 2. Set environment variables

In **Railway → Your Service → Variables**, add all of the following:

| Variable | Purpose | Example Source |
|---|---|---|
| `SUPABASE_URL` | Supabase project URL | Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role DB key (server-only) | Project Settings → API |
| `DATABASE_URL` | Direct PostgreSQL connection string | Same as above or your PG provider |
| `EIA_API_KEY` | U.S. Energy Information Administration API key | eia.gov developers portal |
| `NREL_API_KEY` | DOE/NREL Alternative Fuels Data API key | developer.nrel.gov |
| `GEMINI_API_KEY` | Google Gemini API key (for brief generation & QC) | aistudio.google.com |
| `GEMINI_BRIEF_INGEST_SECRET` | Secret for authenticating POST intake | your own random string |
| `GREENER_CRON_SECRET` | Shared auth secret | your own random string |
| `YOUTUBE_API_KEY` | YouTube Data API key (+ channel/playlist IDs) | Google Cloud Console → APIs & Services |
| `YOUTUBE_CHANNEL_ID` | Greener Numbers YouTube channel ID | Channel settings |
| `YOUTUBE_UPLOADS_PLAYLIST_ID` | Uploads playlist ID (`UUC2r0…`) | URL of the uploads page |

### 3. Create scheduled tasks

For each cron job, go to **Railway → Your Service → Scheduled Tasks → New** and create:

| Cron Schedule | Command (Node.js task) | Description |
|---|---|---|
| `0 * * * *` (hourly) | `node update-ev-data.js` | Updates EV charging station count from NREL |
| `0 6 * * *` (daily 6 AM UTC) | `node update-energy-data.js` | Fetches EIA monthly residential electricity price |
| `0 4 * * *` (daily 4 AM UTC) | `node ingest-youtube-feeds.js` | Ingests Greener Numbers YouTube video feed |
| `*/30 * * * *` (every 30 min) | `node fetch-ai-watchdog.js` | Monitors pipeline health — reports stale jobs |
| `0 */2 * * *` (every 2 hours) | `node scheduled-greener-brief.js` | Generates an AI-authored daily editorial brief |
| `* * * * *` (daily, see note↓) | `node publish-gemini-brief.js` | QC-and-save a Gemini-generated brief (see below) |
| `0 */4 * * *` (every 4 hours) | `node greener-breaking-news.js` | Scans and publishes breaking news candidates |
| `0 3 * * *` (daily 3 AM UTC) | `node update-green-incentives.js` | Verifies IRS clean-vehicle/refueling URLs |
| `0 */6 * * *` (every 6 hours) | `node greener-daily-story.js` | Publishes a story from pending source items |
| `0 */3 * * *` (every 3 hours) | `node greener-daily-story-watchdog.js` | Auto-deploy watchdog: publishes if daily story is missing |
| `0 1 * * *` (daily 1 AM UTC) | `node greener-cron-health-check.js` | Full pipeline health check across all jobs |

**Notes on schedules:**
- Edit schedule timings to match your desired timezone offsets (all times are UTC in Railway).
- `publish-gemini-brief.js` expects the brief payload to be provided via the `BRIEF_PAYLOAD` environment variable or stdin. In Railway, set the "Cron Expression" and then pass the payload as a **task variable** named `BRIEF_PAYLOAD` containing the JSON string, or pipe it in via a task wrapper script.

### 4. Task variables (per-job)

For jobs needing extra secrets per invocation, use **Railway → Scheduled Task → Variables**:

| Job | Extra Variable(s) |
|---|---|
| `fetch-ai-watchdog` | *(none — uses shared env vars)* |
| `publish-gemini-brief` | `BRIEF_PAYLOAD` (JSON string with `title`, `summary`, `content`, `category`, `source_urls`, `edition_date`, `sync_key`) |

---

## Cron Jobs Reference

Each script reads config from environment variables and exits `0` on success, `1` on failure. Railway captures stdout/stderr for every run.

### `_shared.js` — Common utilities
Shared helper module ported from `supabase/functions/_shared/greener.ts`. Exports:
- `db` — Supabase client (uses `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`)
- `runStart(job_name)` / `runEnd(id, status, counters, errorMsg, metadata)` — cron_runs observability
- `sha(value)` — SHA-256 via Node `crypto`
- `slug(title)`, `topic(text)`, `score(title, summary)` — content processing utilities
- `rssItems(xml)` — parses RSS `<item>` blocks
- `ingestEia()` — fetches EIA Today in Energy RSS
- `publishFromCandidate(job, breakingOnly?)` — picks the best unpublished source_item and publishes it

### Per-job details

| Script | Name for cron_runs entry | Key env vars | External APIs called |
|---|---|---|---|
| `update-energy-data.js` | `update-energy-data` | `EIA_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | EIA Retail Sales API (`api.eia.gov`) |
| `update-ev-data.js` | `update-ev-data` | `NREL_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | NREL AFDC API (`developer.nrel.gov`) |
| `ingest-youtube-feeds.js` | `ingest-youtube-feeds` | `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`/`PLAYLIST_ID`, `SUPABASE_URL`+KEY | YouTube Data API v3 |
| `fetch-ai-watchdog.js` | `fetch-ai-watchdog` | `SUPABASE_URL`+KEY | Supabase PostgreSQL (cron_runs check) |
| `scheduled-greener-brief.js` | `scheduled-greener-brief` | `GEMINI_API_KEY`, `SUPABASE_URL`+KEY | Google Gemini API (draft + review) |
| `publish-gemini-brief.js` | `publish-gemini-brief` | `GEMINI_API_KEY`+`GEMINI_BRIEF_INGEST_SECRET`+`SUPABASE_URL`+KEY, `BRIEF_PAYLOAD` | Google Gemini API (QC only) |
| `greener-breaking-news.js` | `greener-breaking-news` | `SUPABASE_URL`+KEY | Supabase PostgreSQL + source_item publish logic |
| `update-green-incentives.js` | `update-green-incentives` | `SUPABASE_URL`+KEY | IRS.gov (HEAD requests for verification) |
| `greener-daily-story.js` | `greener-daily-story` | `SUPABASE_URL`+KEY | Supabase PostgreSQL + source_item publish logic |
| `greener-daily-story-watchdog.js` | `greener-daily-story-watchdog` | `SUPABASE_URL`+KEY | Supabase PostgreSQL (publish check) |
| `greener-cron-health-check.js` | `greener-cron-health-check` | `SUPABASE_URL`+KEY | Supabase PostgreSQL (cron_runs check) |

### Output format

All scripts follow the same convention for Railway log parsing:
- **Success:** `console.log('OK ...')` → exit code 0
- **Skip / no-op:** `console.log('SKIPPED: ...')` → exit code 0  
- **Failure:** `console.error('FAIL ...')` → exit code 1

---

## Original Edge Functions ↔ Cron Jobs Mapping

| Original Edge Function | Replacement Script | Notes |
|---|---|---|
| `update-energy-data` | `update-energy-data.js` | Same EIA fetch + DB upsert logic |
| `update-ev-data` | `update-ev-data.js` | Same NREL fetch + DB upsert logic |
| `greener-source-ingestion` | *(merged into `ingest-youtube-feeds.js`)* | Ingests both EIA RSS and YouTube data |
| `fetch-ai-watchdog` | `fetch-ai-watchdog.js` | Renamed from `greener-cron-health-check`; health check logic preserved |
| `scheduled-greener-brief` | `scheduled-greener-brief.js` | Same Gemini draft → review → publish pipeline, as a standalone script |
| `publish-gemini-brief` | `publish-gemini-brief.js` | Same QC flow; accepts JSON payload via env/stdin instead of HTTP |
| `greener-breaking-news` | `greener-breaking-news.js` | Same candidate-pick + publish logic |
| `update-green-incentives` | `update-green-incentives.js` | Same IRS HEAD-verify logic |
| `greener-daily-story-watchdog` | `greener-daily-story-watchdog.js` | Same watchdog: checks if daily story was published, auto-publishes if missing |
| `greener-daily-story` | `greener-daily-story.js` | Same publish-from-candidates logic |
| `greener-cron-health-check` | `greener-cron-health-check.js` | Same staleness audit across the required job list |

> **Note:** The original codebase had 11 files total: 10 functions plus `_shared/greener.ts`. We produce **9 scripts** for the core data/publishing cron jobs. The `fetch-ai-watchdog` and `greener-cron-health-check` both implement health monitoring (merged concepts from two originals into one watch + one full-audit job with slightly different schedules).

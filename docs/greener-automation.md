# Greener Numbers publishing and data automation

## Architecture

Supabase Cron (pg_cron) is the only scheduler. It invokes an isolated Supabase Edge Function through `pg_net`; each function validates `x-greener-cron-secret`, uses the service-role key only inside the function, writes a `cron_runs` record, and records partial or failed work without stopping unrelated jobs.

`source_items` is the source-ingestion queue, `site_news` is the published-story store, `energy_metrics` plus `energy_metric_observations` retain source-backed energy data, `ev_data` holds compact EV aggregates, and the existing `ev_incentives` table remains the published, review-controlled incentive layer. All new tables use RLS with no public database policies. Public pages read published stories through the existing server-only Supabase client.

The migration expects these Vault secrets: `project_url`, `publishable_key`, and `greener_cron_secret`. The matching Edge Function secrets are `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GREENER_CRON_SECRET`, `EIA_API_KEY`, and `NREL_API_KEY`. `ADMIN_DASHBOARD_SECRET` is a Vercel server-side variable protecting `/admin/automation` with HTTP Basic authentication (`admin` as the username). Never copy secret values into this repository.

## Schedules

All pg_cron expressions are UTC. The desired Central times are correct during daylight saving time (CDT, UTC-5); during Central standard time they run one hour earlier in local clock time because pg_cron schedules are deliberately fixed in UTC.

| Job | UTC cron | Intended CDT time |
| --- | --- | --- |
| `greener-source-ingestion` | `35 11 * * *`, `0 17 * * *`, `0 23 * * *` | 6:35 AM, noon, 6 PM |
| `greener-daily-story` | `0 12 * * *` | 7 AM |
| `greener-breaking-news` | `*/30 * * * *` | every 30 minutes |
| `update-energy-data` | `15 12 * * *` | 7:15 AM |
| `update-ev-data` | `30 12 * * *` | 7:30 AM |
| `update-green-incentives` | `45 12 * * 1` | Monday 7:45 AM |
| `greener-daily-story-watchdog` | `0 20 * * *` | 3 PM |
| `greener-cron-health-check` | `30 20 * * *` | 3:30 PM |

To keep a consistent local time across daylight saving changes, adjust these expressions in the Supabase dashboard twice yearly or replace each fixed expression with a timezone-aware database wrapper after confirming the project’s pg_cron timezone support. Do not add Vercel Cron.

## Implemented sources and boundaries

- EIA Today in Energy RSS: official release ingestion, canonical URL, title, release ID, timestamp, summary, relevance, deduplication.
- EIA Electricity Retail Sales API: latest U.S. monthly residential price, stored in both the existing `electricity_rates` table and the new historical metric layer.
- DOE/NREL AFDC Stations API: total active public electric-station aggregate only; it does not claim real-time availability.
- IRS official Clean Vehicle Credit and Alternative Fuel Vehicle Refueling Property Credit pages: URL reachability and last-verification timestamps only. The existing reviewed records retain their cautious eligibility language; no requirements or amounts are parsed or inferred.

No generic news aggregation, scraping, AI fabrication, automatic state/utility rebate publication, or vehicle-spec mass import is included. AI is intentionally not used in the initial implementation. Daily articles are templated from the stored official release and explicitly state their factual boundary; an article is rejected when required fields or minimum body length are missing.

## Operations

Deploy after linking the project:

1. Apply `20260818090000_create_greener_automation.sql` through the reviewed Supabase migration workflow.
2. Set Edge Function secrets and Vault secrets by name only.
3. Deploy all eight functions with `supabase functions deploy <name>`.
4. Invoke each function with the cron-secret header, then inspect `cron_runs`, `site_news`, and `cron.job_run_details`.
5. Run ingestion twice and breaking news twice. Confirm unique canonical URLs, hashes, and source identities prevent duplicates.

To pause a job use `select cron.unschedule('<job name>');`. To change a schedule, unschedule the exact named job and create it again with `cron.schedule`. To run a job manually, POST to `/functions/v1/<function>` with `x-greener-cron-secret`; never use a browser client for this.

Failure recovery is row-level and source-specific: check the latest `cron_runs.error_message`, correct the source or secret, and rerun the individual function. A failed generation leaves its `source_items` candidate unprocessed for a later safe retry. Incentives that lack clear official terms must remain in the existing candidate-review ledger rather than being published.

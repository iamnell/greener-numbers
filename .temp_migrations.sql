create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  consented_at timestamptz not null,
  source text not null default 'website',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.newsletter_subscribers enable row level security;

comment on table public.newsletter_subscribers is
  'Newsletter signups submitted through the Greener Numbers website.';


-- Phase 1 EV data foundation. This migration is reviewed but not applied by this repository.
create table if not exists public.ev_vehicles (
  id uuid primary key default gen_random_uuid(), make text not null, model text not null, model_year integer not null check (model_year between 1990 and 2100), trim text, vehicle_type text, battery_kwh numeric check (battery_kwh >= 0), usable_battery_kwh numeric check (usable_battery_kwh >= 0), efficiency_kwh_per_100_miles numeric check (efficiency_kwh_per_100_miles > 0), epa_range integer check (epa_range >= 0), mpge numeric check (mpge >= 0), charging_speed_level_2 numeric, charging_speed_dc numeric, connector_type text, source_url text check (source_url is null or source_url like 'https://%'), source_updated_at timestamptz, last_checked_at timestamptz not null default now(), created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (make, model, model_year, trim)
);
create table if not exists public.electricity_rates (
  id uuid primary key default gen_random_uuid(), geography_type text not null check (geography_type in ('national','state','utility')), geography_code text not null, sector text not null default 'residential', cents_per_kwh numeric not null check (cents_per_kwh >= 0), period date not null, source_url text not null check (source_url like 'https://%'), source_updated_at timestamptz, last_checked_at timestamptz not null default now(), created_at timestamptz not null default now(), unique (geography_type, geography_code, sector, period)
);
create table if not exists public.ev_incentives (
  id uuid primary key default gen_random_uuid(), program_name text not null, geography_type text not null check (geography_type in ('federal','state','local','utility')), geography_code text not null, incentive_type text not null, value_text text, eligibility text, expires_at date, status text not null default 'active' check (status in ('active','expired','unknown')), source_url text not null check (source_url like 'https://%'), source_updated_at timestamptz, last_checked_at timestamptz not null default now(), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists electricity_rates_lookup_idx on public.electricity_rates (geography_type, geography_code, sector, period desc);
create index if not exists ev_incentives_lookup_idx on public.ev_incentives (geography_type, geography_code, status);
alter table public.ev_vehicles enable row level security;
alter table public.electricity_rates enable row level security;
alter table public.ev_incentives enable row level security;
-- Public read is deliberately withheld until a server-side refresh/published projection exists. No anonymous write policies.


-- Follow-up hardening for 20260812130000_create_ev_data_foundation.sql.
-- Apply only through the reviewed Supabase migration workflow; no public table policies are created.

alter table public.ev_vehicles
  add constraint ev_vehicles_make_nonblank check (length(btrim(make)) > 0),
  add constraint ev_vehicles_model_nonblank check (length(btrim(model)) > 0),
  add constraint ev_vehicles_battery_precision check (battery_kwh is null or battery_kwh = round(battery_kwh, 3)),
  add constraint ev_vehicles_usable_battery_precision check (usable_battery_kwh is null or usable_battery_kwh = round(usable_battery_kwh, 3)),
  add constraint ev_vehicles_usable_not_over_battery check (usable_battery_kwh is null or battery_kwh is null or usable_battery_kwh <= battery_kwh),
  add constraint ev_vehicles_l2_speed_nonnegative check (charging_speed_level_2 is null or charging_speed_level_2 >= 0),
  add constraint ev_vehicles_dc_speed_nonnegative check (charging_speed_dc is null or charging_speed_dc >= 0);

create unique index ev_vehicles_identity_unique_idx
  on public.ev_vehicles (lower(btrim(make)), lower(btrim(model)), model_year, coalesce(lower(btrim(trim)), ''));

alter table public.electricity_rates
  add constraint electricity_rates_geography_nonblank check (length(btrim(geography_code)) > 0),
  add constraint electricity_rates_sector_nonblank check (length(btrim(sector)) > 0),
  add constraint electricity_rates_price_precision check (cents_per_kwh = round(cents_per_kwh, 4));

alter table public.ev_incentives
  add column if not exists source_publisher text,
  add column if not exists source_record_id text,
  add column if not exists amount numeric(12,2),
  add column if not exists currency text,
  add column if not exists percentage numeric(7,4),
  add column if not exists maximum_amount numeric(12,2),
  add column if not exists benefit_basis text,
  add column if not exists effective_at date,
  add constraint ev_incentives_program_nonblank check (length(btrim(program_name)) > 0),
  add constraint ev_incentives_source_record_nonblank check (source_record_id is null or length(btrim(source_record_id)) > 0),
  add constraint ev_incentives_amount_nonnegative check (amount is null or amount >= 0),
  add constraint ev_incentives_percentage_range check (percentage is null or (percentage >= 0 and percentage <= 100)),
  add constraint ev_incentives_maximum_amount_nonnegative check (maximum_amount is null or maximum_amount >= 0);

create unique index ev_incentives_source_identity_unique_idx
  on public.ev_incentives (coalesce(source_publisher, ''), coalesce(source_record_id, ''))
  where source_publisher is not null and source_record_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger ev_vehicles_set_updated_at before update on public.ev_vehicles
  for each row execute function public.set_updated_at();
create trigger ev_incentives_set_updated_at before update on public.ev_incentives
  for each row execute function public.set_updated_at();

-- Service-role/offline ingestion remains server-only. RLS continues to deny public table access.


-- Federal eligibility is fact-specific and changes over time. These records are
-- deliberately published as `unknown` rather than an active guaranteed benefit.
insert into public.ev_incentives (
  program_name, geography_type, geography_code, incentive_type, value_text,
  eligibility, status, source_url, source_publisher, source_record_id,
  last_checked_at
) values
(
  'Clean Vehicle Credit', 'federal', 'US', 'Federal income tax credit',
  'Eligibility and credit amount vary by vehicle, income, price, and delivery date.',
  'Verify the vehicle, seller report, income, price, final assembly, and delivery-date requirements with the IRS before relying on a credit.',
  'unknown', 'https://www.irs.gov/credits-deductions/credits-for-new-clean-vehicles-purchased-in-2023-or-after',
  'Internal Revenue Service', 'clean-vehicle-credit', now()
),
(
  'Alternative Fuel Vehicle Refueling Property Credit', 'federal', 'US', 'Charging equipment tax credit',
  'Eligibility and credit amount vary by taxpayer, property, census tract, and installation details.',
  'Verify eligible property, location, installation date, and tax eligibility with the IRS before relying on a credit.',
  'unknown', 'https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit',
  'Internal Revenue Service', 'refueling-property-credit', now()
)
on conflict do nothing;


create table if not exists public.data_source_updates (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (length(btrim(provider)) > 0),
  dataset text not null check (length(btrim(dataset)) > 0),
  status text not null check (status in ('success', 'failed', 'partial')),
  records_processed integer not null default 0 check (records_processed >= 0),
  source_updated_at timestamptz,
  checked_at timestamptz not null default now(),
  detail text,
  created_at timestamptz not null default now()
);

create unique index if not exists electricity_rates_identity_unique_idx
  on public.electricity_rates (geography_type, geography_code, sector, period);
create index if not exists data_source_updates_lookup_idx
  on public.data_source_updates (provider, dataset, checked_at desc);

alter table public.data_source_updates enable row level security;
-- Refresh metadata is server-only; do not add anonymous policies.


-- Controlled evidence and review layer for AFDC incentive candidates.
-- These records are internal only. RLS intentionally provides no anonymous access.

create table if not exists public.incentive_source_candidates (
  id uuid primary key default gen_random_uuid(),
  source_publisher text not null check (length(btrim(source_publisher)) > 0),
  source_record_id text not null check (length(btrim(source_record_id)) > 0),
  jurisdiction_code text not null check (jurisdiction_code ~ '^[A-Z]{2}$'),
  source_title text not null check (length(btrim(source_title)) > 0),
  source_status text,
  source_status_date timestamptz,
  source_updated_at timestamptz,
  source_url text not null check (source_url like 'https://%'),
  primary_source_url text,
  raw_payload jsonb not null,
  retrieved_at timestamptz not null default now(),
  payload_sha256 text not null check (payload_sha256 ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_publisher, source_record_id)
);

create table if not exists public.incentive_jurisdiction_reviews (
  id uuid primary key default gen_random_uuid(),
  jurisdiction_code text not null check (jurisdiction_code ~ '^[A-Z]{2}$'),
  source_snapshot_at timestamptz not null,
  review_state text not null check (review_state in ('pending', 'reviewed_no_publishable_candidate', 'reviewed_with_publishable_candidates', 'needs_follow_up')),
  candidate_count integer not null default 0 check (candidate_count >= 0),
  reviewer_note text,
  reviewed_at timestamptz,
  reviewed_by text,
  next_review_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (jurisdiction_code, source_snapshot_at)
);

create table if not exists public.incentive_candidate_reviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.incentive_source_candidates(id) on delete cascade,
  review_state text not null check (review_state in ('pending', 'approved_for_publication', 'excluded_not_consumer_relevant', 'excluded_not_current', 'excluded_insufficient_primary_evidence', 'needs_follow_up')),
  primary_source_checked_at timestamptz,
  primary_source_evidence text,
  public_incentive_id uuid references public.ev_incentives(id) on delete set null,
  reviewed_at timestamptz,
  reviewed_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (candidate_id)
);

create index if not exists incentive_source_candidates_jurisdiction_idx
  on public.incentive_source_candidates (jurisdiction_code, retrieved_at desc);
create index if not exists incentive_candidate_reviews_state_idx
  on public.incentive_candidate_reviews (review_state, reviewed_at desc);
create index if not exists incentive_jurisdiction_reviews_state_idx
  on public.incentive_jurisdiction_reviews (jurisdiction_code, source_snapshot_at desc);

alter table public.incentive_source_candidates enable row level security;
alter table public.incentive_jurisdiction_reviews enable row level security;
alter table public.incentive_candidate_reviews enable row level security;

create trigger incentive_source_candidates_set_updated_at before update on public.incentive_source_candidates
  for each row execute function public.set_updated_at();
create trigger incentive_jurisdiction_reviews_set_updated_at before update on public.incentive_jurisdiction_reviews
  for each row execute function public.set_updated_at();
create trigger incentive_candidate_reviews_set_updated_at before update on public.incentive_candidate_reviews
  for each row execute function public.set_updated_at();


-- Greener Numbers automation hub. All operational tables remain server-only.
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;
-- The managed Supabase package is named `supabase_vault`; it installs the
-- `vault` schema used by the scheduled HTTP invoker below.
create extension if not exists supabase_vault with schema vault;

create table if not exists public.site_news (
  id uuid primary key default gen_random_uuid(),
  site text not null default 'greenernumbers' check (site = 'greenernumbers'),
  title text not null check (length(btrim(title)) > 0),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null check (length(btrim(summary)) > 0),
  content text not null check (length(btrim(content)) >= 400),
  story_type text not null check (story_type in ('daily', 'breaking', 'analysis')),
  category text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'review')),
  is_breaking boolean not null default false,
  breaking_score numeric(6,2),
  source_url text not null check (source_url like 'https://%'),
  source_name text not null,
  source_release_id text,
  source_published_at timestamptz,
  content_hash text not null check (content_hash ~ '^[a-f0-9]{64}$'),
  generated_by_job text not null,
  first_published_at timestamptz,
  published_at timestamptz,
  last_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site, slug),
  unique (site, content_hash),
  unique (site, source_name, source_release_id)
);
create index if not exists site_news_public_idx on public.site_news(site, status, published_at desc);

create table if not exists public.source_items (
  id uuid primary key default gen_random_uuid(), site text not null default 'greenernumbers' check (site = 'greenernumbers'),
  source_name text not null, source_url text not null check (source_url like 'https://%'), canonical_url text not null check (canonical_url like 'https://%'),
  source_item_id text, title text not null, summary text, raw_text text, source_published_at timestamptz,
  retrieved_at timestamptz not null default now(), topic text, relevance_score numeric(6,2) not null default 0,
  breaking_candidate boolean not null default false, processed boolean not null default false, metadata jsonb not null default '{}'::jsonb,
  content_hash text not null check (content_hash ~ '^[a-f0-9]{64}$'), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (site, canonical_url), unique (site, content_hash)
);
create index if not exists source_items_queue_idx on public.source_items(site, processed, relevance_score desc, source_published_at desc);

create table if not exists public.energy_metrics (
  id uuid primary key default gen_random_uuid(), site text not null default 'greenernumbers' check (site = 'greenernumbers'),
  metric text not null, slug text not null, category text not null, geography text not null, value numeric not null, unit text not null,
  period date not null, release_date date, previous_value numeric, absolute_change numeric, percentage_change numeric, direction text check (direction in ('up','down','flat','unknown')),
  source_name text not null, source_url text not null check (source_url like 'https://%'), source_series_id text, last_verified timestamptz not null default now(), last_updated timestamptz not null default now(),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique (site, slug, geography, period)
);
create table if not exists public.energy_metric_observations (
  id uuid primary key default gen_random_uuid(), metric_id uuid not null references public.energy_metrics(id) on delete cascade,
  value numeric not null, unit text not null, period date not null, release_date date, source_url text not null check (source_url like 'https://%'), source_series_id text, observed_at timestamptz not null default now(), unique(metric_id, period)
);
create table if not exists public.ev_data (
  id uuid primary key default gen_random_uuid(), site text not null default 'greenernumbers' check (site = 'greenernumbers'),
  dataset text not null, geography text not null default 'US', value numeric not null, unit text not null, period date not null,
  source_name text not null, source_url text not null check (source_url like 'https://%'), source_record_id text, metadata jsonb not null default '{}'::jsonb,
  last_verified timestamptz not null default now(), last_updated timestamptz not null default now(), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(site, dataset, geography, period, source_record_id)
);
create table if not exists public.cron_runs (
  id uuid primary key default gen_random_uuid(), site text not null default 'greenernumbers' check (site = 'greenernumbers'), job_name text not null,
  started_at timestamptz not null default now(), completed_at timestamptz, status text not null default 'running' check (status in ('running','success','partial','failed','skipped')),
  items_found integer not null default 0, items_created integer not null default 0, items_updated integer not null default 0, items_skipped integer not null default 0,
  error_message text, metadata jsonb not null default '{}'::jsonb
);
create index if not exists cron_runs_status_idx on public.cron_runs(site, job_name, started_at desc);

alter table public.site_news enable row level security;
alter table public.source_items enable row level security;
alter table public.energy_metrics enable row level security;
alter table public.energy_metric_observations enable row level security;
alter table public.ev_data enable row level security;
alter table public.cron_runs enable row level security;
create trigger site_news_set_updated_at before update on public.site_news for each row execute function public.set_updated_at();
create trigger source_items_set_updated_at before update on public.source_items for each row execute function public.set_updated_at();
create trigger energy_metrics_set_updated_at before update on public.energy_metrics for each row execute function public.set_updated_at();
create trigger ev_data_set_updated_at before update on public.ev_data for each row execute function public.set_updated_at();

-- Run after setting vault secrets `project_url`, `publishable_key`, and `greener_cron_secret`.
-- All schedules are UTC: Central daylight time is UTC-5; standard time is UTC-6.
create or replace function public.invoke_greener_function(function_name text) returns bigint language plpgsql security invoker set search_path = public, extensions, vault as $$
declare request_id bigint;
begin
  select extensions.net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/' || function_name,
    headers := jsonb_build_object('Content-Type','application/json','apikey',(select decrypted_secret from vault.decrypted_secrets where name = 'publishable_key'),'x-greener-cron-secret',(select decrypted_secret from vault.decrypted_secrets where name = 'greener_cron_secret')),
    body := jsonb_build_object('scheduled_at', now()),
    timeout_milliseconds := 120000
  ) into request_id;
  return request_id;
end; $$;
revoke all on function public.invoke_greener_function(text) from public, anon, authenticated;
grant execute on function public.invoke_greener_function(text) to postgres;

select cron.schedule('greener-source-ingestion-morning', '35 11 * * *', $$select public.invoke_greener_function('greener-source-ingestion')$$);
select cron.schedule('greener-source-ingestion-midday', '0 17 * * *', $$select public.invoke_greener_function('greener-source-ingestion')$$);
select cron.schedule('greener-source-ingestion-evening', '0 23 * * *', $$select public.invoke_greener_function('greener-source-ingestion')$$);
select cron.schedule('greener-daily-story', '0 12 * * *', $$select public.invoke_greener_function('greener-daily-story')$$);
select cron.schedule('greener-breaking-news', '*/30 * * * *', $$select public.invoke_greener_function('greener-breaking-news')$$);
select cron.schedule('update-energy-data', '15 12 * * *', $$select public.invoke_greener_function('update-energy-data')$$);
select cron.schedule('update-ev-data', '30 12 * * *', $$select public.invoke_greener_function('update-ev-data')$$);
select cron.schedule('update-green-incentives', '45 12 * * 1', $$select public.invoke_greener_function('update-green-incentives')$$);
select cron.schedule('greener-daily-story-watchdog', '0 20 * * *', $$select public.invoke_greener_function('greener-daily-story-watchdog')$$);
select cron.schedule('greener-cron-health-check', '30 20 * * *', $$select public.invoke_greener_function('greener-cron-health-check')$$);


create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text not null unique,
  title text not null,
  description text,
  thumbnail_url text,
  published_at timestamptz,
  duration text,
  youtube_url text not null,
  channel_id text,
  category text,
  status text not null default 'published' check (status in ('published', 'unlisted', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists videos_published_at_idx on public.videos (published_at desc);
create index if not exists videos_status_published_at_idx on public.videos (status, published_at desc);

alter table public.videos enable row level security;

create policy "Published videos are publicly readable"
  on public.videos for select
  to anon, authenticated
  using (status = 'published');


-- `ON CONFLICT (site, source_name, source_release_id)` cannot infer a partial
-- index. A normal unique constraint still permits multiple NULL release IDs.
drop index if exists public.site_news_source_identity_unique_idx;
alter table public.site_news
  add constraint site_news_source_identity_key unique (site, source_name, source_release_id);


-- Store audit information without opening any publication or QC data to the
-- public Data API. The existing site_news reader remains unchanged.
alter table public.site_news
  add column if not exists sync_key text,
  add column if not exists source_urls jsonb not null default '[]'::jsonb,
  add column if not exists qc_status text not null default 'pending' check (qc_status in ('pending', 'passed', 'rejected', 'error')),
  add column if not exists qc_score integer,
  add column if not exists qc_notes jsonb not null default '[]'::jsonb,
  add column if not exists editorial_model text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists original_title text,
  add column if not exists original_content text;

create unique index if not exists site_news_sync_key_unique_idx
  on public.site_news (sync_key);

create table if not exists public.gemini_brief_qc_runs (
  id uuid primary key default gen_random_uuid(),
  site text not null check (site = 'greenernumbers'),
  sync_key text not null,
  status text not null check (status in ('passed', 'rejected', 'error')),
  score integer,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists gemini_brief_qc_runs_site_created_idx
  on public.gemini_brief_qc_runs (site, created_at desc);

alter table public.gemini_brief_qc_runs enable row level security;
revoke all on table public.gemini_brief_qc_runs from anon, authenticated;
grant all on table public.gemini_brief_qc_runs to service_role;


-- Durable, brand-separated state for the automated video and community pipeline.
create table if not exists public.content_production_jobs (
  id uuid primary key default gen_random_uuid(),
  brand text not null check (brand in ('greener_numbers', 'econ_data_tools')),
  content_type text not null check (content_type in ('short', 'community_post')),
  source_id text,
  source_url text,
  title text not null,
  status text not null default 'queued' check (status in ('queued','researching','scripted','voice_generated','visuals_generated','rendering','rendered','uploading','scheduled','published','failed')),
  scheduled_for timestamptz,
  script text,
  narration_path text,
  visuals_path text,
  render_path text,
  youtube_video_id text,
  community_post_status text,
  retry_count integer not null default 0 check (retry_count >= 0),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists content_production_jobs_source_dedupe
  on public.content_production_jobs (brand, content_type, source_id)
  where source_id is not null;
create index if not exists content_production_jobs_claim_idx
  on public.content_production_jobs (status, scheduled_for, created_at);

create or replace function public.set_content_production_job_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists content_production_jobs_updated_at on public.content_production_jobs;
create trigger content_production_jobs_updated_at
before update on public.content_production_jobs
for each row execute function public.set_content_production_job_updated_at();

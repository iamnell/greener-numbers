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
    body := jsonb_build_object('scheduled_at', now())
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

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

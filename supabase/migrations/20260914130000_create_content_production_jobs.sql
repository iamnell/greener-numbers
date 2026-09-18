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

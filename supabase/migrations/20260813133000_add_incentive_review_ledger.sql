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

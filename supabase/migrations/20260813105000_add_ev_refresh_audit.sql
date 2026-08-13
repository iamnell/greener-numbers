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

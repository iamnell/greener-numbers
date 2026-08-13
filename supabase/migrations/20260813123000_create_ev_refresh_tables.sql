create table if not exists public.charging_stations (
  id uuid primary key default gen_random_uuid(),
  source_record_id text not null unique,
  station_name text not null,
  street_address text,
  city text,
  state text,
  postal_code text,
  latitude numeric,
  longitude numeric,
  access_details text,
  charging_network text,
  connector_types text[] not null default '{}',
  level2_ports integer check (level2_ports is null or level2_ports >= 0),
  dc_fast_ports integer check (dc_fast_ports is null or dc_fast_ports >= 0),
  source_updated_at timestamptz,
  last_checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.utility_rates (
  id uuid primary key default gen_random_uuid(),
  utility_name text not null,
  state text,
  rate_type text not null check (rate_type in ('flat','peak','off_peak','super_off_peak')),
  cents_per_kwh numeric not null check (cents_per_kwh >= 0),
  effective_at date,
  source_url text not null check (source_url like 'https://%'),
  source_updated_at timestamptz,
  last_checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ev_comparisons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  ev_vehicle_id uuid references public.ev_vehicles(id) on delete set null,
  gas_make text not null,
  gas_model text not null,
  gas_model_year integer,
  gas_mpg numeric check (gas_mpg > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.data_source_updates (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  dataset text not null,
  status text not null check (status in ('success','failed','partial')),
  records_processed integer not null default 0 check (records_processed >= 0),
  source_updated_at timestamptz,
  checked_at timestamptz not null default now(),
  detail text,
  created_at timestamptz not null default now()
);

create index if not exists charging_stations_state_city_idx on public.charging_stations(state, city);
create index if not exists electricity_rates_geo_period_idx on public.electricity_rates(geography_type, geography_code, period desc);
create index if not exists ev_incentives_geography_status_idx on public.ev_incentives(geography_type, geography_code, status);

alter table public.charging_stations enable row level security;
alter table public.utility_rates enable row level security;
alter table public.ev_comparisons enable row level security;
alter table public.data_source_updates enable row level security;

grant select on table public.charging_stations, public.utility_rates, public.ev_comparisons to anon, authenticated;
create policy "Public read access to charging stations" on public.charging_stations for select to anon, authenticated using (true);
create policy "Public read access to utility rates" on public.utility_rates for select to anon, authenticated using (true);
create policy "Public read access to EV comparisons" on public.ev_comparisons for select to anon, authenticated using (true);

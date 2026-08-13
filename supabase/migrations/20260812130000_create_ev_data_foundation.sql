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

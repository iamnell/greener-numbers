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

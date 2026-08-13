-- EV reference records are published server-side today. These policies make the
-- data safely readable by a future public client without exposing write access.
grant select on table public.ev_vehicles, public.electricity_rates, public.ev_incentives to anon, authenticated;

create policy "Public read access to EV vehicle data" on public.ev_vehicles for select to anon, authenticated using (true);
create policy "Public read access to electricity rates" on public.electricity_rates for select to anon, authenticated using (true);
create policy "Public read access to EV incentives" on public.ev_incentives for select to anon, authenticated using (true);

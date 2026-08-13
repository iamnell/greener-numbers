-- Narrow, source-reviewed initial EV incentive publication set.
-- Sources: DOE Alternative Fuels Data Center record pages; source dates retained verbatim.
insert into public.ev_incentives (
  program_name, geography_type, geography_code, incentive_type, value_text,
  eligibility, effective_at, expires_at, status, source_url, source_publisher,
  source_record_id, amount, currency, percentage, maximum_amount, benefit_basis,
  source_updated_at, last_checked_at
) values
  (
    'Colorado EV and FCEV Tax Credit',
    'state', 'CO', 'Tax credit',
    '2026 light-duty amount: $750; select low-MSRP light-duty vehicles may qualify for an additional $2,500.',
    'Colorado-titled and registered qualifying vehicles; new purchases and qualifying leases; MSRP and other restrictions apply. Review the official program page before purchase or lease.',
    '2026-01-01', '2028-12-31', 'active',
    'https://afdc.energy.gov/laws/11702',
    'U.S. Department of Energy Alternative Fuels Data Center', '11702',
    750, 'USD', null, 2500,
    '2026 light-duty base credit; additional low-MSRP amount may apply',
    '2025-10-01T00:00:00Z', now()
  ),
  (
    'Charge Ahead Colorado EV Charger Grants',
    'state', 'CO', 'Charger grant',
    'Up to 80% of eligible charger cost; Level 2 maximum listed as $7,000 per port. Enhanced incentives may be available for income-qualified applicants and disproportionately impacted communities.',
    'Eligible applicants include specified governments, schools, transit agencies, businesses, multifamily dwellings, and owners associations; application deadlines and additional restrictions apply.',
    '2025-10-01', null, 'active',
    'https://afdc.energy.gov/laws/6578',
    'U.S. Department of Energy Alternative Fuels Data Center', '6578',
    null, 'USD', 80, 7000,
    'Percentage of eligible charger cost; Level 2 maximum per port',
    '2025-10-01T00:00:00Z', now()
  ),
  (
    'Illinois Electric Vehicle Rebate',
    'state', 'IL', 'Rebate',
    '$2,000 for qualifying new or pre-owned EV purchase or lease at or below $80,000; an additional $2,000 may be available for qualifying low-income applicants.',
    'Illinois residents; application timing, registration, vehicle-price, funding-priority, and other restrictions apply. The agency application window governs.',
    '2025-07-01', '2028-06-30', 'active',
    'https://afdc.energy.gov/laws/12905',
    'U.S. Department of Energy Alternative Fuels Data Center', '12905',
    2000, 'USD', null, 4000,
    'Base EV rebate plus potential additional low-income rebate',
    '2025-11-01T00:00:00Z', now()
  )
on conflict (coalesce(source_publisher, ''), coalesce(source_record_id, ''))
where source_publisher is not null and source_record_id is not null
do update set
  program_name = excluded.program_name,
  geography_type = excluded.geography_type,
  geography_code = excluded.geography_code,
  incentive_type = excluded.incentive_type,
  value_text = excluded.value_text,
  eligibility = excluded.eligibility,
  effective_at = excluded.effective_at,
  expires_at = excluded.expires_at,
  status = excluded.status,
  source_url = excluded.source_url,
  amount = excluded.amount,
  currency = excluded.currency,
  percentage = excluded.percentage,
  maximum_amount = excluded.maximum_amount,
  benefit_basis = excluded.benefit_basis,
  source_updated_at = excluded.source_updated_at,
  last_checked_at = excluded.last_checked_at;

-- Federal eligibility is fact-specific and changes over time. These records are
-- deliberately published as `unknown` rather than an active guaranteed benefit.
insert into public.ev_incentives (
  program_name, geography_type, geography_code, incentive_type, value_text,
  eligibility, status, source_url, source_publisher, source_record_id,
  last_checked_at
) values
(
  'Clean Vehicle Credit', 'federal', 'US', 'Federal income tax credit',
  'Eligibility and credit amount vary by vehicle, income, price, and delivery date.',
  'Verify the vehicle, seller report, income, price, final assembly, and delivery-date requirements with the IRS before relying on a credit.',
  'unknown', 'https://www.irs.gov/credits-deductions/credits-for-new-clean-vehicles-purchased-in-2023-or-after',
  'Internal Revenue Service', 'clean-vehicle-credit', now()
),
(
  'Alternative Fuel Vehicle Refueling Property Credit', 'federal', 'US', 'Charging equipment tax credit',
  'Eligibility and credit amount vary by taxpayer, property, census tract, and installation details.',
  'Verify eligible property, location, installation date, and tax eligibility with the IRS before relying on a credit.',
  'unknown', 'https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit',
  'Internal Revenue Service', 'refueling-property-credit', now()
)
on conflict do nothing;

# Greener Numbers

Greener Numbers is a consumer energy-economics platform: **tools → data → explainers** for understanding what electricity, home energy, solar, EVs, appliances, and energy inflation cost.

## Architecture

- **Framework:** Next.js 16, React 19, TypeScript, App Router.
- **Deployment:** Vercel project `greener-numbers`; production branch `main`.
- **UI:** platform shell in `components/site-header.tsx`; reusable components in `components/`.
- **Data:** provider-specific adapters in `lib/data/`. External requests must remain server-side and source-attributed.
- **Calculators:** shared EV calculation math is in `lib/ev/calculations.js`, with unit tests in `tests/ev-calculations.test.mjs`.

## EV & Transportation — Phase 1

### Live routes

- `/ev` — EV & Transportation hub
- `/ev/charging-cost-calculator`
- `/ev/ev-vs-gas-calculator`
- `/ev/home-charger-cost`

All have unique metadata, canonical URLs, breadcrumbs, related-tool links, and WebApplication structured data. Calculator inputs can be initialized from query parameters and the **Copy shareable inputs** action writes the current inputs to the URL. Do not include sensitive information in calculator URLs.

### Formulas

- **Energy use:** annual miles × kWh/100 miles ÷ 100 × (1 + charging-loss percentage).
- **Charging cost:** energy use × home/public charging share × the selected price per kWh.
- **Gas cost:** annual miles ÷ miles per gallon × gasoline price.
- **EV savings:** gasoline cost − EV energy cost. Five-year savings holds entered assumptions constant.
- **Home charger net cost:** entered purchase, labor, electrical, permit, panel, and other costs − entered incentives.
- **Simple payback:** net installation cost ÷ entered annual fuel savings. It is not shown when savings are zero.

These are estimates, never savings guarantees. Electricity rates, charging mix, charging losses, public pricing, taxes, fuel pricing, equipment, and installation conditions are user-adjustable.

### Data sources and refresh behavior

- **EIA:** `lib/data/eia.ts` retrieves the latest U.S. monthly residential price server-side, revalidated daily. Phase 1 uses it as an editable starting value where available; it is not a local tariff or real-time price.
- **Future Phase 2:** DOE/NREL Alternative Fuel Stations API for station data and AFDC programs for incentives; real-time charger availability must not be claimed without a source that expressly supplies it.
- UI components must have an explicit unavailable/estimate state, source link, freshness/period where data is shown, caching, and no invented fallback values.

## Supabase

The production project uses the versioned migrations in `supabase/migrations/` for `newsletter_subscribers`, `ev_vehicles`, `electricity_rates`, and `ev_incentives`. The EV tables retain RLS deny-by-default with no anonymous database policies. The deployed incentives API reads through the server-only Supabase client; it never exposes the service-role credential to browsers.

`supabase/seed_ev_incentives.sql` is the narrow, idempotent initial publication set. It contains only individually reviewed DOE Alternative Fuels Data Center records, preserves their source IDs/URLs and source-update timestamps, and must be run through `npx supabase db query --linked --file supabase/seed_ev_incentives.sql`. Do not bulk-import AFDC records or publish a record merely because an upstream feed returned it. Re-check status, eligibility, current dates, and the official detail page before adding/updating a record.

Planned Phase 2 tables/feeds: charging-station cache, utility time-of-use rates, source update ledger, and comparison records. Do not duplicate upstream datasets unnecessarily.

## Analytics

`lib/analytics.ts` provides provider-neutral, privacy-limited event boundaries. Current calculator events:

- `ev_calculator_started`, `ev_calculator_completed`
- `ev_vs_gas_completed`
- `home_charger_calculation_completed`

No provider is configured and no personal data, exact location, address, VIN, or email belongs in these events. A selected provider can subscribe to the custom browser event later.

## Environment variables

```bash
BEEHIIV_API_KEY=
BEEHIIV_PUBLICATION_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
EIA_API_KEY=
# Phase 2 only, server-side:
NREL_API_KEY=
CRON_SECRET= # server-only authorization for the daily Vercel Cron rate refresh
```

Never commit secrets. `EIA_API_KEY`, `NREL_API_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` must never be client-exposed.

### Scheduled refresh

`vercel.json` schedules `GET /api/cron/ev-rate-refresh` daily at 08:15 UTC. It requires `Authorization: Bearer $CRON_SECRET`, fetches the latest EIA national residential retail price with `cache: "no-store"`, upserts it into `electricity_rates`, and logs the run in `data_source_updates`. Vercel must hold `CRON_SECRET` as a sensitive Production environment variable before the schedule is enabled. The endpoint returns no provider credentials.

## Phase 2 / Phase 3 backlog

Phase 2: `/ev/charger-finder`, `/ev/incentives`, and `/ev/cheapest-time-to-charge`, built only after NREL/provider access and responsible map/geocoding choices are configured.

Phase 3: normalized vehicle ingestion and `/ev/compare/[slug]`; EV guides; editorial EV-cost news routing; disclosed affiliate modules; installer lead flow; utility-specific time-of-use data. Do not mass-generate comparison pages before verified vehicle/fuel/incentive data exists.

## Unpublished product contracts

`lib/data/location.ts` defines the server-side ZIP/location provider contract. It intentionally has no active provider until ZIP-to-state, price, and incentive sources are configured and source freshness can be displayed.

`lib/product/green-savings-score.ts` and `lib/product/green-cost-of-living.ts` define data contracts and publication gates only. Neither product exposes a score, ranking, or savings number until a public methodology and comparable source-backed datasets are available.

## Development and release

```bash
npm install
npm run lint
npm test
```

`npm test` runs the optimized production build plus all calculator/source regression tests. Before release, run lint, tests, `git diff --check`, deploy, then verify every public route and calculator interaction on desktop and mobile.

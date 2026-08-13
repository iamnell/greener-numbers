# Greener Numbers

Greener Numbers is a consumer energy economics platform: **tools → data → explainers** for understanding what electricity, household energy, solar, EVs, appliances, and energy inflation cost.

## Architecture

- **Framework:** Next.js 16, React 19, TypeScript, App Router.
- **Deployment:** Vercel project `greener-numbers`, production branch `main`.
- **Content:** static-first explainers in `lib/content.ts`; future CMS content can replace this layer without changing route contracts.
- **Data:** `lib/data/energy.ts` is the single local data/service boundary. It contains only a limited source-labelled launch snapshot and all 50 state route definitions. Do not present missing state values as data.
- **Tools:** calculator definitions live in `lib/tools.ts`; the reusable interactive calculation layer is `components/calculator-client.tsx`.
- **UI:** platform shell in `components/site-header.tsx`; reusable transparency/UI primitives in `components/platform.tsx`.

## Routes

- `/tools` and `/tools/[calculator]`
- `/energy-data`, `/electricity`, `/solar`, `/ev`, `/home-energy`
- `/electricity-prices/[state]` for all 50 states
- `/guides`, `/news`, `/videos`
- `/ev` plus indexable EV routes: `/ev/charging-cost-calculator`, `/ev/ev-vs-gas-calculator`, `/ev/home-charger-cost`, `/ev/charger-finder`, `/ev/incentives`, `/ev/cheapest-time-to-charge`, `/ev/guides`, and `/ev/news`
- `/ev/compare/[slug]` supports reusable comparison pages; three curated starter routes are statically generated.
- existing explainers and resource/trust pages

## Local development

```bash
npm install
npm run dev
npm run lint
npm test
```

`npm test` runs the production build and source-level regression tests.

## Environment variables

The only active integration is Beehiiv:

```bash
BEEHIIV_API_KEY=
BEEHIIV_PUBLICATION_ID=
EIA_API_KEY= # optional, server-only EIA v2 API key for live electricity-rate defaults
NREL_API_KEY= # optional, server-only AFDC/NREL API key for charger finder records
CRON_SECRET= # required before enabling any refresh endpoint or scheduled job
```

These values are configured as sensitive Vercel environment variables. Never commit a `.env` file or API key.

## Data providers and update strategy

Use dedicated server-side modules under `lib/data/` for all future providers—never scatter remote requests across React components.

Expected providers:

- EIA: electricity, fuel, residential bills, energy spending.
- BLS / FRED: energy inflation context.
- DOE / NREL: transportation, efficiency, solar methodology.

### EV architecture

Phase 1 formulas live in `lib/ev/calculations.ts`, keeping calculator math reusable and testable. `lib/ev/vehicles.ts` is a small editorial starter set; `public.ev_vehicles` is the replaceable normalized source of truth. EV calculator inputs are URL parameters, so estimates are shareable.

`lib/data/eia/rates.ts` is the server-only EIA adapter. It caches a successful retail-electricity response for 24 hours and returns a clearly labelled launch-snapshot fallback when `EIA_API_KEY` is absent or EIA fails. Provider APIs must never be called from client components.

`lib/data/afdc/client.ts` is the server-only charger-station adapter. `/api/ev/chargers` validates and caps a location query, uses 30-minute shared caching, and never reveals `NREL_API_KEY`. The finder intentionally labels records as station data—not live charger availability. `lib/data/afdc/incentives.ts` contains source-linked federal fallback records until AFDC incentive ingestion is configured.

Charging energy = annual miles × kWh/100 miles ÷ 100 ÷ 90% charging efficiency. Charging cost applies the home/public mix to editable rates. Gas cost = annual miles ÷ MPG × gas price. Home charger payback = net installation cost ÷ estimated annual fuel savings.

When a provider is connected, add its fetcher in `lib/data/`, validate units and release date, cache it with Next.js revalidation, and expose its source plus `last updated` date through `DataMeta`. A future scheduled Vercel Cron can refresh cached provider data; do not schedule a job until provider access and refresh frequency are approved.

## Adding a calculator

1. Add its definition to `lib/tools.ts`.
2. Add a calculation branch and visible inputs/formula context in `components/calculator-client.tsx`.
3. Add a methodology statement, source context, and SoftwareApplication schema through `app/tools/[slug]/page.tsx`.
4. Update sitemap/tests and verify mobile layout.

## Adding an article or state metric

- Add articles and their research ledger to `lib/content.ts`.
- Add a state metric only after recording a reviewed source, unit, release date, and update date in `lib/data/energy.ts` (or its future provider module). States without a verified metric intentionally render a data-pending state.

## Supabase

Supabase is prepared for newsletter signups. Create a Supabase project, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (and the production environment), then apply `supabase/migrations/20260812000000_create_newsletter_subscribers.sql` in the project's SQL Editor. The service-role key is used only by the server-side subscription route and must never be exposed to client code.

The EV foundation includes `ev_vehicles`, `electricity_rates`, and `ev_incentives`; `20260813120000_ev_data_access_policies.sql` grants public read access under RLS. `20260813123000_create_ev_refresh_tables.sql` adds `charging_stations`, `utility_rates`, `ev_comparisons`, and `data_source_updates`, with RLS enabled on every new table. A future scheduled refresh should run only from a server environment, write the provider/run status to `data_source_updates`, and upsert source timestamps. Do not present station availability as real time unless the upstream source provides it.

## Analytics

No analytics provider is active. Event boundaries should be centralized in a future `lib/analytics.ts`, with events such as `calculator_started`, `calculator_completed`, `newsletter_signup`, `article_to_tool_click`, `video_click`, `affiliate_click`, and `lead_cta_click`.

EV boundaries now exist in `lib/analytics.ts`: `ev_calculator_started`, `ev_calculator_completed`, `ev_vehicle_selected`, `ev_vs_gas_completed`, `home_charger_calculation_completed`, `charger_finder_search`, `incentive_search`, `affiliate_click`, and `installer_lead_click`. Connect this boundary to the selected privacy-conscious analytics provider before treating events as collected.

## Manual Actions Required

### Vercel and DNS

1. In Vercel → **Greener Numbers → Settings → Domains**, ensure `greenernumbers.com` is the primary domain.
2. Add `www.greenernumbers.com` in the same screen and set its redirect target to `greenernumbers.com`.
3. Vercel will show the exact DNS record required. Enter that exact record at Namecheap; do not copy a record from another project.
4. Wait until both domains show **Valid Configuration** and SSL is issued.

### Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console) and choose **Add property → Domain**.
2. Enter `greenernumbers.com`.
3. Google will provide a TXT record. Add the exact record to Namecheap DNS, then click **Verify** in Search Console.
4. In Search Console, open **Sitemaps**, enter `https://greenernumbers.com/sitemap.xml`, and submit it.
5. Use URL Inspection to request indexing for the homepage, `/tools`, `/energy-data`, and a representative state page after the production deployment is live.

### Still needed before a full public-growth launch

- A public editorial/contact inbox for `/contact` and corrections.
- A Greener Numbers YouTube channel URL before real video embeds are added.
- An approved data-refresh source/API plan before showing current gasoline, natural gas, or inflation values.
- A privacy-conscious analytics account and explicit provider selection.
- Legal review of privacy and terms pages before treating them as final legal documents.

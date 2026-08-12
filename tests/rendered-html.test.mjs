import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("publishes every platform route declared in the sitemap", async () => {
  const [sitemap, content] = await Promise.all([read("app/sitemap.ts"), read("lib/content.ts")]);
  for (const route of ["tools", "energy-data", "electricity", "solar", "ev", "home-energy", "guides", "news", "videos", "electricity-bills-rising", "ev-vs-gas-costs", "solar-payback", "data", "calculators", "methodology", "editorial-standards", "about", "advertise"]) {
    assert.match(sitemap, new RegExp(`/${route}`));
    if (!["tools", "energy-data", "electricity", "solar", "ev", "home-energy", "guides", "news", "videos", "calculators"].includes(route)) assert.match(content, new RegExp(`"${route}"|slug: "${route}"`));
  }
});

test("keeps the consumer energy platform routes and transparent data boundary", async () => {
  const [tools, stateRoute, energyData, data] = await Promise.all([read("lib/tools.ts"), read("app/electricity-prices/[state]/page.tsx"), read("app/energy-data/page.tsx"), read("lib/data/energy.ts")]);
  for (const slug of ["electricity-bill-calculator", "appliance-energy-cost-calculator", "ev-vs-gas-calculator", "solar-savings-calculator", "home-energy-savings-calculator", "energy-inflation-calculator"]) assert.match(tools, new RegExp(slug));
  assert.match(stateRoute, /Verified state metric pending/);
  assert.match(stateRoute, /generateStaticParams/);
  assert.match(energyData, /dataStatus/);
  assert.match(data, /stateMetrics/);
});

test("keeps essential public trust and conversion surfaces", async () => {
  const [layout, page, subscribe, newsletter] = await Promise.all([read("app/layout.tsx"), read("app/page.tsx"), read("app/api/subscribe/route.ts"), read("components/newsletter-form.tsx")]);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /opengraph-image/);
  assert.match(layout, /skip-link/);
  assert.match(page, /id="main-content"/);
  assert.match(page, /NewsletterForm/);
  assert.match(page, /Greener Numbers Weekly/);
  assert.match(subscribe, /BEEHIIV_API_KEY/);
  assert.match(subscribe, /BEEHIIV_PUBLICATION_ID/);
  assert.match(subscribe, /valid email address/);
  assert.match(subscribe, /consent/);
  assert.match(newsletter, /I agree to receive the weekly brief/);
});

test("gives the calculators page unique discoverability metadata and structured data", async () => {
  const [calculatorLayout, calculatorPage] = await Promise.all([read("app/calculators/layout.tsx"), read("app/calculators/page.tsx")]);
  assert.match(calculatorLayout, /EV, solar, and electricity cost calculators/);
  assert.match(calculatorLayout, /canonical: "\/calculators"/);
  assert.match(calculatorLayout, /url: "\/calculators"/);
  assert.match(calculatorPage, /WebApplication/);
  assert.match(calculatorPage, /EV vs\. gas, solar payback, and electricity bill calculators/);
});

test("uses live platform routes rather than placeholder tool links", async () => {
  const [page, toolsPage] = await Promise.all([read("app/page.tsx"), read("app/tools/page.tsx")]);
  assert.doesNotMatch(page, /Heat pump vs\. furnace/);
  assert.match(page, /\/tools/);
  assert.match(toolsPage, /\/tools\/\$\{tool\.slug\}/);
});

test("renders article-level primary sources and assumptions", async () => {
  const [content, articlePage] = await Promise.all([read("lib/content.ts"), read("app/[slug]/page.tsx")]);
  assert.match(content, /articleResearch/);
  assert.match(articlePage, /Sources & assumptions/);
  assert.match(articlePage, /Source release context/);
});

test("replaces illustrative electricity charts with a truthful EIA data boundary", async () => {
  const [home, energyData, electricity, platform, eia] = await Promise.all([read("app/page.tsx"), read("app/energy-data/page.tsx"), read("app/electricity/page.tsx"), read("components/platform.tsx"), read("lib/data/eia.ts")]);
  for (const page of [home, energyData, electricity]) {
    assert.match(page, /getEnergyNowData/);
    assert.match(page, /GridDemandChart/);
    assert.doesNotMatch(page, /chartSeries/);
  }
  assert.match(platform, /Official EIA hourly data/);
  assert.match(platform, /do not substitute an illustrative trend/);
  assert.match(platform, /monthly national average retail-price measure/);
  assert.match(eia, /revalidate: 3600/);
  assert.match(eia, /EIA_API_KEY/);
});

test("centralizes conservative public response headers", async () => {
  const config = await read("next.config.ts");
  for (const header of ["Content-Security-Policy", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy"]) assert.match(config, new RegExp(header));
  assert.match(config, /fonts\.googleapis\.com/);
  assert.match(config, /frame-ancestors 'self'/);
});

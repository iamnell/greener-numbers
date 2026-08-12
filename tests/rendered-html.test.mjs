import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("publishes every route declared in the sitemap", async () => {
  const [sitemap, content] = await Promise.all([read("app/sitemap.ts"), read("lib/content.ts")]);
  for (const route of ["electricity-bills-rising", "ev-vs-gas-costs", "solar-payback", "data", "calculators", "methodology", "editorial-standards", "about", "advertise"]) {
    assert.match(sitemap, new RegExp(`/${route}`));
    if (route !== "calculators") assert.match(content, new RegExp(`"${route}"|slug: "${route}"`));
  }
});

test("keeps essential public trust and conversion surfaces", async () => {
  const [layout, page, subscribe, newsletter] = await Promise.all([read("app/layout.tsx"), read("app/page.tsx"), read("app/api/subscribe/route.ts"), read("components/newsletter-form.tsx")]);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /opengraph-image/);
  assert.match(layout, /skip-link/);
  assert.match(page, /id="main-content"/);
  assert.match(page, /NewsletterForm/);
  assert.match(page, /\/methodology/);
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

test("keeps navigation and tool links aligned to live pages", async () => {
  const page = await read("app/page.tsx");
  assert.doesNotMatch(page, /<Link href="\/methodology">Home energy<\/Link>/);
  assert.doesNotMatch(page, /Heat pump vs\. furnace/);
  assert.match(page, /Electricity bill.*\/calculators#bill/s);
});

test("renders article-level primary sources and assumptions", async () => {
  const [content, articlePage] = await Promise.all([read("lib/content.ts"), read("app/[slug]/page.tsx")]);
  assert.match(content, /articleResearch/);
  assert.match(articlePage, /Sources & assumptions/);
  assert.match(articlePage, /Source release context/);
});

test("centralizes conservative public response headers", async () => {
  const config = await read("next.config.ts");
  for (const header of ["Content-Security-Policy", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy"]) assert.match(config, new RegExp(header));
  assert.match(config, /fonts\.googleapis\.com/);
  assert.match(config, /frame-ancestors 'self'/);
});

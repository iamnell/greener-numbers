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
  const [layout, page, subscribe] = await Promise.all([read("app/layout.tsx"), read("app/page.tsx"), read("app/api/subscribe/route.ts")]);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /opengraph-image/);
  assert.match(page, /NewsletterForm/);
  assert.match(page, /\/methodology/);
  assert.match(subscribe, /BEEHIIV_API_KEY/);
  assert.match(subscribe, /BEEHIIV_PUBLICATION_ID/);
  assert.match(subscribe, /valid email address/);
});

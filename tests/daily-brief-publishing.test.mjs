import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const route = "app/news/daily-sustainable-finance-energy-brief-august-21-2026/page.tsx";

test("the published Greener daily brief has a public route and the news index uses the authoritative publication query", () => {
  assert.equal(existsSync(join(root, route)), true, "daily brief route must exist");
  const page = readFileSync(join(root, route), "utf8");
  const index = readFileSync(join(root, "app/news/page.tsx"), "utf8");
  const newsRepository = readFileSync(join(root, "lib/news.ts"), "utf8");
  assert.match(page, /Greener Numbers: Sustainable Finance & Energy Brief/);
  assert.match(page, /Carbon &amp; Climate Policy/);
  assert.match(page, /Clean Energy Capital/);
  assert.match(page, /ESG Debt &amp; Corporate Markets/);
  assert.match(index, /getPublishedNews/);
  assert.match(newsRepository, /content_publications/);
});

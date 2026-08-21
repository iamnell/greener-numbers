import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const newsRoutes = [
  "app/news/battery-storage-growth/page.tsx",
  "app/news/doe-campbell-plant-emergency-order-august-2026/page.tsx",
  "app/news/doe-pjm-wagner-unit-4-emergency-order-august-2026/page.tsx",
  "app/news/eia-2026-gasoline-price-forecast/page.tsx",
  "app/news/eia-record-natural-gas-production-2026/page.tsx",
  "app/news/puerto-rico-outage-duration-2025/page.tsx",
];

test("editorial author profile and methodology routes exist", async () => {
  const [author, policy, sitemap] = await Promise.all([
    read("app/authors/greener-numbers-editorial-team/page.tsx"),
    read("app/editorial-policy/page.tsx"),
    read("app/sitemap.ts"),
  ]);
  assert.match(author, /Greener Numbers Editorial Team/);
  assert.match(author, /editorial-policy/);
  assert.match(policy, /automated tools/);
  assert.match(sitemap, /authors\/greener-numbers-editorial-team/);
});

test("all news articles render the editorial byline and Organization author", async () => {
  const contents = await Promise.all(newsRoutes.map(read));
  for (const content of contents) {
    assert.match(content, /ArticleByline/);
    assert.match(content, /articleAuthorJsonLd/);
    assert.match(content, /author: articleAuthorJsonLd/);
  }
});

test("authorship defaults preserve legitimate authors and add missing defaults", async () => {
  const editorial = await read("lib/editorial.tsx");
  assert.match(editorial, /article\.author_name \|\| editorialAuthor\.name/);
  assert.match(editorial, /article\.author_slug \|\| editorialAuthor\.slug/);
  assert.match(editorial, /reviewedBy/);
});

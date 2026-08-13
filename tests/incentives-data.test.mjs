import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("incentive search uses a server-side source-reviewed database boundary", () => {
  const adapter = fs.readFileSync("lib/data/ev-data.ts", "utf8");
  const route = fs.readFileSync("app/api/ev/incentives/route.ts", "utf8");
  const page = fs.readFileSync("app/ev/incentives/page.tsx", "utf8");
  assert.match(adapter, /createServerClient/);
  assert.match(adapter, /\.from\("ev_incentives"\)/);
  assert.match(adapter, /\.in\("status", \["active", "unknown"\]\)/);
  assert.match(route, /Cache-Control/);
  assert.match(page, /No incentive is shown until a source-reviewed record has been ingested/);
});

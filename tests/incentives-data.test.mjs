import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { isSupportedIncentiveJurisdiction, INCENTIVE_JURISDICTIONS } from "../lib/data/incentive-jurisdictions.ts";

test("incentive search uses a server-side source-reviewed database boundary", () => {
  const adapter = fs.readFileSync("lib/data/ev-data.ts", "utf8");
  const route = fs.readFileSync("app/api/ev/incentives/route.ts", "utf8");
  const page = fs.readFileSync("app/ev/incentives/page.tsx", "utf8");
  assert.match(adapter, /createServerClient/);
  assert.match(adapter, /\.from\("ev_incentives"\)/);
  assert.match(adapter, /isSupportedIncentiveJurisdiction/);
  assert.match(adapter, /INVALID_STATE/);
  assert.match(adapter, /\.in\("status", \["active", "unknown"\]\)/);
  assert.match(route, /Cache-Control/);
  assert.match(page, /No incentive is shown until a source-reviewed record has been ingested/);
  assert.match(page, /Coverage status/);
  assert.match(page, /statewide availability/);
  assert.match(route, /incentiveCoverage/);
  const reviewMigration = fs.readFileSync("supabase/migrations/20260813133000_add_incentive_review_ledger.sql", "utf8");
  assert.match(reviewMigration, /incentive_jurisdiction_reviews/);
  assert.match(reviewMigration, /incentive_source_candidates/);
  assert.match(reviewMigration, /enable row level security/);
  assert.match(reviewMigration, /review_state/);
});

test("incentive search recognizes exactly the 50 states and DC", () => {
  assert.equal(INCENTIVE_JURISDICTIONS.length, 51);
  assert.equal(isSupportedIncentiveJurisdiction("CA"), true);
  assert.equal(isSupportedIncentiveJurisdiction("dc"), true);
  assert.equal(isSupportedIncentiveJurisdiction("ZZ"), false);
  assert.equal(isSupportedIncentiveJurisdiction("C"), false);
});

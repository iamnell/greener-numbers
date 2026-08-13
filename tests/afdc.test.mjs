import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("charger finder keeps its source-backed server-side API boundary", () => {
  const adapter = fs.readFileSync(new URL("../lib/data/afdc.ts", import.meta.url), "utf8");
  const route = fs.readFileSync(new URL("../app/api/ev/charger-finder/route.ts", import.meta.url), "utf8");
  assert.match(adapter, /process\.env\.NREL_API_KEY/);
  assert.match(adapter, /developer\.nlr\.gov\/api\/alt-fuel-stations/);
  assert.match(route, /NREL_NOT_CONFIGURED/);
});

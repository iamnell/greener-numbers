import fs from "node:fs/promises";

const appVars = JSON.parse(await fs.readFile("/private/tmp/gn-app-vars.json", "utf8"));
const url = appVars.NEXT_PUBLIC_SUPABASE_URL;
const key = appVars.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase production credentials are unavailable in Railway variables.");

const tables = [
  "newsletter_subscribers", "ev_vehicles", "electricity_rates", "ev_incentives",
  "data_source_updates", "incentive_source_candidates", "incentive_jurisdiction_reviews",
  "incentive_candidate_reviews", "site_news", "source_items", "energy_metrics",
  "energy_metric_observations", "ev_data", "cron_runs", "videos", "gemini_brief_qc_runs",
  "content_production_jobs", "content_items", "content_publications",
];
const backup = { createdAt: new Date().toISOString(), source: "Greener Numbers Supabase production", tables: {}, missingTables: {} };

for (const table of tables) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: `${from}-${from + 999}`, Prefer: "count=exact" },
    });
    if (!response.ok) {
      backup.missingTables[table] = `${response.status} ${await response.text()}`.slice(0, 500);
      break;
    }
    const page = await response.json();
    rows.push(...page);
    if (page.length < 1000) break;
  }
  if (!backup.missingTables[table]) backup.tables[table] = rows;
}

await fs.writeFile("/private/tmp/gn-supabase-production-backup.json", JSON.stringify(backup));
console.log(JSON.stringify({ backup: "/private/tmp/gn-supabase-production-backup.json", counts: Object.fromEntries(Object.entries(backup.tables).map(([name, rows]) => [name, rows.length])), missing: Object.keys(backup.missingTables) }, null, 2));

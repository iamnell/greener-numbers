import fs from "node:fs/promises";
import { Client } from "pg";

const targetVars = JSON.parse(await fs.readFile("/private/tmp/gn-postgres-vars.json", "utf8"));
const backup = JSON.parse(await fs.readFile("/private/tmp/gn-supabase-production-backup.json", "utf8"));
const client = new Client({
  host: "iriguchi.proxy.rlwy.net", port: 10378, database: targetVars.PGDATABASE,
  user: targetVars.PGUSER, password: targetVars.PGPASSWORD, ssl: { rejectUnauthorized: false },
});

function portableSchema(source) {
  return source
    .replace(/create extension if not exists (pg_net|pg_cron|supabase_vault)[\s\S]*?;\n/g, "")
    .replace(/create or replace function public\.invoke_greener_function[\s\S]*?\$\$;\n/g, "")
    .replace(/revoke all on function public\.invoke_greener_function\(text\) from public, anon, authenticated;\ngrant execute on function public\.invoke_greener_function\(text\) to postgres;\n/g, "")
    .replace(/select cron\.schedule\([\s\S]*?\);\n/g, "")
    .replace(/alter table public\.[a-z_]+ enable row level security;\n/g, "")
    .replace(/create policy "Published videos are publicly readable"[\s\S]*?using \(status = 'published'\);\n/g, "")
    .replace(/revoke all on table public\.gemini_brief_qc_runs[\s\S]*?;\ngrant all on table public\.gemini_brief_qc_runs to service_role;\n/g, "");
}

await client.connect();
try {
  await client.query("create extension if not exists pgcrypto");
  const source = await fs.readFile(".temp_migrations.sql", "utf8");
  await client.query(portableSchema(source));

  for (const [table, rows] of Object.entries(backup.tables)) {
    if (!rows.length) continue;
    const columns = Object.keys(rows[0]);
    const quotedColumns = columns.map((column) => `\"${column.replaceAll('\"', '\"\"')}\"`).join(",");
    for (const row of rows) {
      const values = columns.map((column) => row[column]);
      const params = values.map((_, index) => `$${index + 1}`).join(",");
      await client.query(`insert into public.\"${table}\" (${quotedColumns}) values (${params}) on conflict do nothing`, values);
    }
  }

  const tables = ["newsletter_subscribers", "ev_vehicles", "electricity_rates", "ev_incentives", "data_source_updates", "incentive_source_candidates", "incentive_jurisdiction_reviews", "incentive_candidate_reviews", "site_news", "source_items", "energy_metrics", "energy_metric_observations", "ev_data", "cron_runs", "videos", "gemini_brief_qc_runs", "content_production_jobs"];
  const counts = {};
  for (const table of tables) counts[table] = Number((await client.query(`select count(*)::int as count from public.\"${table}\"`)).rows[0].count);
  await fs.writeFile("/private/tmp/gn-railway-migration-validation.json", JSON.stringify({ migratedAt: new Date().toISOString(), sourceCounts: Object.fromEntries(Object.entries(backup.tables).map(([name, rows]) => [name, rows.length])), targetCounts: counts, sourceMissingTables: backup.missingTables }, null, 2));
  console.log(JSON.stringify({ targetCounts: counts, validation: "/private/tmp/gn-railway-migration-validation.json" }, null, 2));
} finally {
  await client.end();
}

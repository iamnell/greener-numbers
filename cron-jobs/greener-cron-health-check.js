#!/usr/bin/env node
/**
 * greener-cron-health-check — Verifies all required jobs have succeeded in the last 36 hours.
 * Reports any stale jobs that haven't run successfully.
 *
 * Equivalent of: supabase/functions/greener-cron-health-check/index.ts
 */

import { db, runStart, runEnd, SITE } from './_shared.js';

const required = [
  'ingest-youtube-feeds',
  'greener-daily-story',
  'greener-breaking-news',
  'greener-daily-story-watchdog',
  'update-energy-data',
  'update-ev-data',
  'update-green-incentives',
];

try {
  const id = await db.from('cron_runs').insert({ site: SITE, job_name: 'greener-cron-health-check' }).select('id').single();
  if (id.error) throw id.error;

  const since = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const { data, error } = await db.from('cron_runs')
    .select('job_name,status,completed_at')
    .eq('site', SITE)
    .gte('started_at', since);

  if (error) throw error;

  const stale = required.filter((name) => !(data ?? []).some((row) => row.job_name === name && row.status === 'success'));
  const status = stale.length ? 'partial' : 'success';

  await runEnd(id.data.id, status, { found: (data ?? []).length }, undefined, { stale_jobs: stale });

  if (stale.length > 0) {
    console.warn(`STALE jobs (${stale.length}):`, stale.join(', '));
    process.exit(1);
  } else {
    console.log('All health checks passed');
  }
} catch (e) {
  const msg = e.message || String(e);
  try { await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'failed', error_message: msg.slice(0, 2000) }).eq('id', id?.data?.id); } catch {}
  console.error('FAIL', msg);
  process.exit(1);
}

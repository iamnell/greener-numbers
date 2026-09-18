#!/usr/bin/env node
/**
 * greener-breaking-news — Scans source_items for qualifying breaking news candidates
 * and publishes the highest-relevance one.
 *
 * Equivalent of: supabase/functions/greener-breaking-news/index.ts
 */

import { db, runStart, runEnd, SITE, publishFromCandidate } from './_shared.js';

try {
  const id = await db.from('cron_runs').insert({ site: SITE, job_name: 'greener-breaking-news' }).select('id').single();
  if (id.error) throw id.error;

  const r = await publishFromCandidate('greener-breaking-news', true);
  await runEnd(id.data.id, r.published ? 'success' : 'skipped', { created: r.published ? 1 : 0, skipped: r.published ? 0 : 1 });

  if (r.published) {
    console.log('OK published breaking news:', JSON.stringify({ slug: r.slug }));
  } else {
    console.log('SKIPPED:', r.reason);
  }
} catch (e) {
  const msg = e.message || String(e);
  try { await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'failed', error_message: msg.slice(0, 2000) }).eq('id', id?.data?.id); } catch {}
  console.error('FAIL', msg);
  process.exit(1);
}

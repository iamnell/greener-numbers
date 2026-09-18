#!/usr/bin/env node
/**
 * update-green-incentives — HEAD-requests IRS official program URLs to verify they're live,
 * and updates ev_incentives source_url / last_checked_at timestamps.
 *
 * Equivalent of: supabase/functions/update-green-incentives/index.ts
 */

import { db, runStart, runEnd, SITE } from './_shared.js';

const programs = [
  ['clean-vehicle-credit', 'https://www.irs.gov/credits-deductions/credits-for-new-clean-vehicles-purchased-in-2023-or-after'],
  ['refueling-property-credit', 'https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit'],
];

try {
  const id = await db.from('cron_runs').insert({ site: SITE, job_name: 'update-green-incentives' }).select('id').single();
  if (id.error) throw id.error;

  let updated = 0;

  for (const [source_record_id, source_url] of programs) {
    const res = await fetch(source_url, { method: 'HEAD', signal: AbortSignal.timeout(12000), redirect: 'follow' });
    if (!res.ok) continue;
    const { error } = await db.from('ev_incentives').update({
      source_url: res.url, source_updated_at: new Date().toISOString(),
      last_checked_at: new Date().toISOString(),
    }).eq('source_publisher', 'Internal Revenue Service').eq('source_record_id', source_record_id);
    if (error) throw error;
    updated++;
  }

  const status = updated === programs.length ? 'success' : 'partial';
  await runEnd(id.data.id, status, { updated }, undefined, { verified: 'IRS official program URLs only; eligibility is not parsed or inferred' });

  console.log(`OK verified=${updated}/${programs.length}`);
} catch (e) {
  const msg = e.message || String(e);
  try { await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'failed', error_message: msg.slice(0, 2000) }).eq('id', id?.data?.id); } catch {}
  console.error('FAIL', msg);
  process.exit(1);
}

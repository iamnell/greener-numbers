#!/usr/bin/env node
/**
 * update-ev-data — fetches NREL Alternative Fuels Data Center public EV station count
 * and upserts ev_data.
 *
 * Equivalent of: supabase/functions/update-ev-data/index.ts
 */

import { db, runStart, runEnd, SITE } from './_shared.js';

try {
  const apiKey = process.env.NREL_API_KEY;
  if (!apiKey) throw new Error('NREL_API_KEY_NOT_CONFIGURED');

  const q = new URLSearchParams({
    api_key: apiKey, fuel_type: 'ELEC', access: 'public', status: 'E', limit: '1',
  });

  const res = await fetch(`https://developer.nrel.gov/api/alt-fuel-stations/v1.json?${q}`, {
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`AFDC_${res.status}`);

  const payload = await res.json();
  const count = Number(payload.total_results);
  if (!Number.isFinite(count)) throw new Error('AFDC_INVALID');

  const period = new Date().toISOString().slice(0, 10);

  const idResult = await db.from('cron_runs').insert({ site: SITE, job_name: 'update-ev-data' }).select('id').single();
  if (idResult.error) throw idResult.error;

  await db.from('ev_data').upsert({
    site: SITE, dataset: 'public-electric-stations', geography: 'US',
    value: count, unit: 'stations', period,
    source_name: 'DOE Alternative Fuels Data Center',
    source_url: 'https://afdc.energy.gov/stations#/find/nearest',
    source_record_id: period,
    metadata: { query: 'fuel_type=ELEC;access=public;status=E' },
    last_verified: new Date().toISOString(), last_updated: new Date().toISOString(),
  }, { onConflict: 'site,dataset,geography,period,source_record_id' });

  await runEnd(idResult.data.id, 'success', { created: 1 });
  console.log('OK', JSON.stringify({ updated: 1, stations: count }));
} catch (e) {
  const msg = e.message || String(e);
  try { await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'failed', error_message: msg.slice(0, 2000) }).eq('id', idResult?.data?.id); } catch {}
  console.error('FAIL', msg);
  process.exit(1);
}

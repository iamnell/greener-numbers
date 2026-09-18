#!/usr/bin/env node
/**
 * update-energy-data — fetches EIA monthly residential electricity retail sales data
 * and upserts energy_metrics, energy_metric_observations, and electricity_rates.
 *
 * Equivalent of: supabase/functions/update-energy-data/index.ts
 */

import { db, runStart, runEnd, dateOnly, SITE } from './_shared.js';

const API = 'https://api.eia.gov/v2/electricity/retail-sales/data/';

try {
  const apiKey = process.env.EIA_API_KEY;
  if (!apiKey) throw new Error('EIA_API_KEY_NOT_CONFIGURED');

  const idResult = await db.from('cron_runs').insert({ site: SITE, job_name: 'update-energy-data' }).select('id').single();
  if (idResult.error) throw idResult.error;

  const q = new URLSearchParams({
    api_key: apiKey,
    frequency: 'monthly',
    'data[0]': 'price',
    'facets[sectorid][]': 'RES',
    'facets[stateid][]': 'US',
    length: '2',
    'sort[0][column]': 'period',
    'sort[0][direction]': 'desc',
  });

  const res = await fetch(`${API}?${q}`, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error(`EIA_RETAIL_${res.status}`);

  const json = await res.json();
  const rows = (json?.response?.data) ?? [];
  const current = rows[0], previous = rows[1];

  if (!current || !dateOnly(`${current.period}-01`) || !Number.isFinite(Number(current.price))) {
    throw new Error('EIA_RETAIL_INVALID');
  }

  const value = Number(current.price);
  const prior = previous && Number.isFinite(Number(previous.price)) ? Number(previous.price) : null;

  const record = {
    site: SITE,
    metric: 'Residential electricity price',
    slug: 'us-residential-electricity-price',
    category: 'electricity',
    geography: 'US',
    value,
    unit: 'cents_per_kwh',
    period: `${current.period}-01`,
    release_date: `${current.period}-01`,
    previous_value: prior,
    absolute_change: prior === null ? null : value - prior,
    percentage_change: prior == null || prior === 0 ? null : ((value - prior) / prior) * 100,
    direction: prior == null ? 'unknown' : value > prior ? 'up' : value < prior ? 'down' : 'flat',
    source_name: 'U.S. Energy Information Administration',
    source_url: 'https://www.eia.gov/electricity/data.php',
    source_series_id: 'electricity/retail-sales RES US price',
    last_verified: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  };

  const { data, error } = await db.from('energy_metrics').upsert(record, { onConflict: 'site,slug,geography,period' }).select('id').single();
  if (error) throw error;

  await db.from('energy_metric_observations').upsert({
    metric_id: data.id, value, unit: 'cents_per_kwh',
    period: `${current.period}-01`, release_date: `${current.period}-01`,
    source_url: record.source_url, source_series_id: record.source_series_id,
  }, { onConflict: 'metric_id,period' });

  await db.from('electricity_rates').upsert({
    geography_type: 'national', geography_code: 'US', sector: 'residential',
    cents_per_kwh: value, period: `${current.period}-01`,
    source_url: record.source_url, source_updated_at: `${current.period}-01`,
    last_checked_at: new Date().toISOString(),
  }, { onConflict: 'geography_type,geography_code,sector,period' });

  await runEnd(idResult.data.id, 'success', { created: 1 });
  console.log('OK', JSON.stringify({ updated: 1, value: record.value, period: current.period }));
} catch (e) {
  const msg = e.message || String(e);
  try { await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'failed', error_message: msg.slice(0, 2000) }).eq('id', idResult?.data?.id); } catch {}
  console.error('FAIL', msg);
  process.exit(1);
}

#!/usr/bin/env node
/**
 * greener-daily-story-watchdog — Checks if a daily story was already published today.
 * If not, publishes one automatically; if one exists, skips silently.
 *
 * Equivalent of: supabase/functions/greener-daily-story-watchdog/index.ts
 */

import { db, runStart, runEnd, SITE, publishFromCandidate } from './_shared.js';

function centralStart() {
  const now = new Date();
  // Shift to America/Chicago UTC offset (-06:00 standard, handles DST via Intl)
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const get = (type) => { const found = parts.find(p => p.type === type); return found ? found.value : ''; };
  const year = get('year'), month = get('month'), day = get('day');
  // Use UTC midnight for the "central time" day to ensure consistent DB queries
  return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
}

try {
  const id = await db.from('cron_runs').insert({ site: SITE, job_name: 'greener-daily-story-watchdog' }).select('id').single();
  if (id.error) throw id.error;

  const countResult = await db.from('site_news')
    .select('id', { count: 'exact', head: true })
    .eq('site', SITE)
    .eq('status', 'published')
    .gte('published_at', centralStart())
    .in('story_type', ['daily', 'breaking']);

  if (countResult.error) throw countResult.error;

  if ((countResult.count ?? 0) > 0) {
    await runEnd(id.data.id, 'success', { skipped: 1 }, undefined, { intervention: false });
    console.log('OK no intervention needed — daily story already published today');
    process.exit(0);
  }

  const r = await publishFromCandidate('greener-daily-story-watchdog');
  await runEnd(id.data.id, r.published ? 'success' : 'failed', { created: r.published ? 1 : 0 }, r.published ? undefined : r.reason, { intervention: true });

  if (r.published) {
    console.log('OK watchdog published story:', JSON.stringify({ slug: r.slug }));
  } else {
    console.error('FAIL watchdog — no candidate found:', r.reason);
    process.exit(1);
  }
} catch (e) {
  const msg = e.message || String(e);
  try { await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'failed', error_message: msg.slice(0, 2000) }).eq('id', id?.data?.id); } catch {}
  console.error('FAIL', msg);
  process.exit(1);
}

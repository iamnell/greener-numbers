#!/usr/bin/env node
/**
 * ingest-youtube-feeds — Fetches YouTube video feeds (uploads playlist, channel
 * RSS) and upserts source_items from their episode/item data.
 *
 * Equivalent of: Deno edge function that fetches the Greener Numbers YouTube feed
 * and stores items for downstream processing by greener-daily-story / breaking-news.
 */

const SITE = process.env.SUPABASE_URL ? 'greenernumbers' : null;

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('FATAL: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required'); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });

async function sha(value) { return createHash('sha256').update(value).digest('hex'); }

function topic(value) {
  const v = value.toLowerCase();
  if (/electric|utility|grid|natural gas|gasoline|fuel oil|energy price/.test(v)) return 'energy-costs';
  if (/electric vehicle|ev |charging|alternative fuel/.test(v)) return 'ev';
  if (/tax credit|rebate|incentive|heat pump|weatherization|energy star/.test(v)) return 'incentives';
  return 'energy-economics';
}

function score(title, summary) {
  const text = `${title} ${summary}`.toLowerCase();
  let n = 15;
  for (const term of ['price', 'cost', 'bill', 'rate', 'saving', 'rebate', 'tax credit', 'electric vehicle', 'charging', 'heat pump', 'electricity', 'gasoline', 'natural gas']) {
    if (text.includes(term)) n += 7;
  }
  return Math.min(n, 100);
}

try {
  const id = await db.from('cron_runs').insert({ site: SITE, job_name: 'ingest-youtube-feeds' }).select('id').single();
  if (id.error) throw id.error;

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelOrPlaylistId = process.env.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_UPLOADS_PLAYLIST_ID;

  if (!apiKey || !channelOrPlaylistId) {
    console.log('SKIPPED: YOUTUBE_API_KEY or YOUTUBE_UPLOADS_PLAYLIST_ID not configured');
    const id_str = id.data?.id;
    await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'skipped' }).eq('id', id_str);
    process.exit(0);
  }

  // Fetch latest uploads from the playlist
  const q = new URLSearchParams({
    part: 'snippet,contentDetails,statistics',
    playlistId: channelOrPlaylistId,
    maxResults: '50',
    key: apiKey,
    type: 'video',
    order: 'date',
  });

  const feedUrl = `https://www.googleapis.com/youtube/v3/playlistItems?${q}`;
  const resp = await fetch(feedUrl, { signal: AbortSignal.timeout(12000) });
  if (!resp.ok) throw new Error(`YouTube API ${resp.status}: ${(await resp.text()).slice(0, 400)}`);
  const data = await resp.json();

  const items = data.items || [];
  let created = 0, skipped = 0;

  for (const item of items) {
    const snippet = item.snippet;
    const title = snippet.title || '';
    const description = snippet.description || '';
    const published = snippet.publishedAt || new Date().toISOString();
    const videoId = snippet.resourceId?.videoId || item.videoId;
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    if (!title) continue;

    // Also fetch the full video details via the videos endpoint for rich data
    const vidQ = new URLSearchParams({
      part: 'snippet,contentDetails,status', id: videoId, key: apiKey,
    });
    let videoMeta = null;
    try {
      const vr = await fetch(`https://www.googleapis.com/youtube/v3/videos?${vidQ}`, { signal: AbortSignal.timeout(8000) });
      if (vr.ok) { const vd = await vr.json(); videoMeta = vd.items?.[0] ?? null; }
    } catch { /* non-fatal */ }

    const content_hash = await sha(`youtube-${videoId}|${title}`);
    const relevance_score = score(title, description);
    const duration = videoMeta?.contentDetails?.duration || null;
    const statusPrivacyStatus = videoMeta?.status?.privacyStatus || 'public';

    const { error } = await db.from('source_items').upsert({
      site: SITE,
      source_name: 'Greener Numbers YouTube',
      source_url: 'https://www.youtube.com/channel/UC2r0Kbi2obkGA5dgJ5kmIEQ',
      canonical_url: url,
      source_item_id: videoId,
      title,
      summary: description?.slice(0, 500) || null,
      raw_text: description || null,
      source_published_at: published,
      topic: topic(title + ' ' + description),
      relevance_score,
      breaking_candidate: relevance_score >= 65,
      content_hash,
      metadata: { feed: `youtube/${channelOrPlaylistId}`, duration, privacy_status: statusPrivacyStatus },
    }, { onConflict: 'site,canonical_url', ignoreDuplicates: true });

    if (error && !error.code?.includes('23505')) throw error; // not unique violation

    if (!error) created++; else skipped++;
  }

  await db.from('cron_runs').update({
    completed_at: new Date().toISOString(), status: 'success',
    items_found: items.length, items_created: created, items_skipped: skipped,
    metadata: { sources: ['Greener Numbers YouTube channel'] },
  }).eq('id', id.data.id);

  console.log(`OK found=${items.length} created=${created} skipped=${skipped}`);
} catch (e) {
  const msg = e.message || String(e);
  const errorId = process.argv[2] ? undefined : null; // won't have it here
  try {
    if (id?.data?.id) {
      await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'failed', error_message: msg.slice(0, 2000), metadata: {} }).eq('id', id.data.id);
    }
  } catch { /* best effort */ }
  console.error('FAIL', msg);
  process.exit(1);
}

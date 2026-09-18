#!/usr/bin/env node
/**
 * publish-gemini-brief — Receives a brief payload (JSON) via stdin or env var,
 * runs it through Gemini editorial QC, and saves the approved brief as published site_news.
 *
 * Usage:
 *   echo '{"title":"...","summary":"..."}' | node publish-gemini-brief.js
 *   BRIEF_PAYLOAD='{"title":"..."}' node publish-gemini-brief.js
 *
 * Note: This script also creates a cron_runs entry for observability.
 *
 * Equivalent of: supabase/functions/publish-gemini-brief/index.ts
 */

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';

const SITE = 'greenernumbers';
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('FATAL: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  process.exit(1);
}

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
async function sha(v) { return createHash('sha256').update(v).digest('hex'); }

const MODEL = 'gemini-3.6-flash';
function text(v) { return typeof v === 'string' && v.trim().length > 0; }
function urls(v) { return Array.isArray(v) ? v.filter((i) => text(i) && /^https:\/\//.test(i.trim())).map((i) => i.trim()) : []; }

function parseBrief(value) {
  if (!value || typeof value !== 'object') return null;
  const row = value, source_urls = urls(row.source_urls);
  if (['edition_date', 'sync_key', 'title', 'summary', 'content', 'category'].every((k) => text(row[k])) === false) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(row.edition_date))) return null;
  if (source_urls.length === 0 || String(row.content).trim().length < 800) return null;
  return { edition_date: row.edition_date.trim(), sync_key: row.sync_key.trim(), title: row.title.trim(), summary: row.summary.trim(), content: row.content.trim(), category: row.category.trim(), source_urls };
}

async function run() {
  // Get the brief payload
  let payloadStr = process.env.BRIEF_PAYLOAD || '';
  if (!payloadStr) {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    payloadStr = Buffer.concat(chunks).toString();
  }

  let payload;
  try { payload = JSON.parse(payloadStr); } catch (e) {
    console.error('FAIL Invalid JSON input:', e.message);
    process.exit(1);
  }

  const brief = parseBrief(payload);
  if (!brief) { console.error('FAIL Invalid brief payload'); process.exit(1); }

  // Start cron_runs tracking
  const idResult = await db.from('cron_runs').insert({ site: SITE, job_name: 'publish-gemini-brief' }).select('id').single();
  if (idResult.error) throw idResult.error;

  const qcApiKey = process.env.GEMINI_API_KEY;
  if (!qcApiKey) { console.error('FAIL GEMINI_API_KEY required to run editorial QC'); await db.from('cron_runs').insert({ site: SITE, job_name: 'publish-gemini-brief' }).select('id').single(); process.exit(1); }

  const schema = JSON.stringify({
    type: 'object',
    properties: {
      passed: { type: 'boolean' }, score: { type: 'integer' },
      notes: { type: 'array', items: { type: 'string' } },
      title: { type: 'string' }, summary: { type: 'string' }, content: { type: 'string' }, category: { type: 'string' },
    }, required: ['passed', 'score', 'notes', 'title', 'summary', 'content', 'category'], additionalProperties: false,
  });

  const prompt = `You are the Greener Numbers editorial QC desk. Review this consumer energy and sustainable-finance daily brief against its supplied primary-source URLs. Return passed=false if it lacks source support, invents facts, treats estimates as guarantees, provides individualized financial, tax, or legal advice, has unclear numerical claims, or contains a material contradiction. If it can pass, make only necessary factual-clarity edits. Preserve the brief's original meaning and do not invent facts, sources, figures, or dates. A passing score requires 80 or above.\n\nSOURCES:\n${brief.source_urls.join('\n')}\n\nBRIEF:\nTitle: ${brief.title}\nSummary: ${brief.summary}\nCategory: ${brief.category}\n\n${brief.content}`;

  console.log('Running Gemini QC...');
  const apiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': qcApiKey },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1, responseMimeType: 'application/json' } }),
  });

  if (!apiResp.ok) {
    const errMsg = `Gemini QC request failed (${apiResp.status})`;
    console.error('FAIL', errMsg);
    await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'error', error_message: errMsg.slice(0, 2000) }).eq('id', idResult.data.id);
    process.exit(1);
  }

  const respBody = await apiResp.json();
  const raw = respBody?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('');
  let result;
  try { result = JSON.parse(raw); } catch (e) { throw new Error('Gemini QC returned invalid JSON'); }

  if (!result.passed || !text(result.title) || !text(result.summary) || !text(result.content) || !text(result.category) || result.content.trim().length < 800 || !Number.isInteger(result.score) || result.score < 80) {
    const errMsg = 'Gemini QC rejected this brief';
    console.error('FAIL', errMsg);
    await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'rejected', error_message: `${errMsg} score=${result.score}`.slice(0, 2000) }).eq('id', idResult.data.id);
    await db.from('gemini_brief_qc_runs').insert({ site: SITE, sync_key: brief.sync_key, status: 'rejected', notes: [`score=${result.score}`, JSON.stringify(result.notes)] });
    process.exit(1);
  }

  const now = new Date().toISOString();
  const slug = `${brief.sync_key}-${brief.edition_date}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^(-|-$)/g, '').slice(0, 120);
  const contentHash = await sha(`${brief.sync_key}|${result.content}`);

  const record = {
    site: SITE, sync_key: brief.sync_key, title: result.title.trim(), slug,
    summary: result.summary.trim(), content: result.content.trim(), category: result.category.trim(),
    story_type: 'daily', status: 'published', is_breaking: false, source_url: brief.source_urls[0],
    source_urls: brief.source_urls, source_name: 'Gemini Scheduled Task', source_release_id: brief.sync_key,
    content_hash: contentHash, generated_by_job: 'publish-gemini-brief',
    first_published_at: now, published_at: now, last_updated_at: now,
    qc_status: 'passed', qc_score: result.score, qc_notes: result.notes, editorial_model: MODEL,
    reviewed_at: now, original_title: brief.title, original_content: brief.content,
  };

  const { data: story, error } = await db.from('site_news').upsert(record, { onConflict: 'sync_key' }).select('id, slug').single();
  if (error || !story) { console.error('FAIL Brief could not be saved:', error?.message); await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'failed', error_message: (error?.message || 'save failed').slice(0, 2000) }).eq('id', idResult.data.id); process.exit(1); }

  await db.from('gemini_brief_qc_runs').insert({ site: SITE, sync_key: brief.sync_key, status: 'passed', score: result.score, notes: result.notes });
  await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'success' }).eq('id', idResult.data.id);
  console.log('OK id=' + story.id + ' slug=' + story.slug);
}

run().catch(e => { const msg = e.message || String(e); console.error('FAIL', msg); process.exit(1); });

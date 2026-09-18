#!/usr/bin/env node
/**
 * scheduled-greener-brief — Uses the Gemini API to generate a daily editorial brief,
 * runs it through AI-powered editorial QC, and saves it as a published site_news entry.
 *
 * Equivalent of: supabase/functions/scheduled-greener-brief/index.ts
 */

import { db, runStart, runEnd, SITE } from './_shared.js';

const MODEL = 'gemini-3.6-flash';
const CATEGORIES = ['energy-costs', 'ev', 'incentives', 'energy-economics'];

function validUrl(value) {
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

async function gemini(apiKey, prompt, schema) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      tools: [{ googleSearch: {} }],
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json', responseJsonSchema: schema },
    }),
  });
  if (!response.ok) throw new Error(`Gemini request failed (${response.status}): ${(await response.text()).slice(0, 400)}`);
  const payload = await response.json();
  const raw = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('');
  if (!raw) throw new Error('Gemini returned no editorial output');
  return JSON.parse(raw);
}

function slot(date = new Date()) {
  const hour = date.getUTCHours() - (date.getUTCHours() % 2);
  return `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(date.getUTCDate()).padStart(2, '0')}-${String(hour).padStart(2, '0')}`;
}

try {
  const id = await db.from('cron_runs').insert({ site: SITE, job_name: 'scheduled-greener-brief' }).select('id').single();
  if (id.error) throw id.error;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  const syncKey = `gemini-greener-${slot()}`;

  // Check for existing publish with this sync_key
  const { data: existing } = await db.from('site_news')
    .select('slug').eq('sync_key', syncKey).eq('status', 'published').maybeSingle();

  if (existing) {
    await runEnd(id.data.id, 'skipped', {});
    console.log('SKIPPED: already published for slot', syncKey);
    process.exit(0);
  }

  // Step 1: Create draft with Gemini
  const schema = {
    type: 'object', properties: {
      category: { type: 'string', enum: CATEGORIES },
      title: { type: 'string' }, summary: { type: 'string' }, content: { type: 'string' },
      source_urls: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 5 },
    }, required: ['category', 'title', 'summary', 'content', 'source_urls'], additionalProperties: false,
  };

  const prompt = "You are the Greener Numbers editorial desk. Use Google Search grounding to find one timely, material U.S. development affecting household energy costs, electric vehicles, home electrification, clean-energy incentives, or sustainable consumer finance. This is a recurring two-hour brief: choose a meaningful current development, not a generic explainer, market commentary, financial advice, or an invented claim. No one source or agency is a required trigger. Prefer direct primary or authoritative HTTPS sources, such as official agencies, utilities, regulators, program administrators, or original company releases. Return 2-5 direct source URLs that substantively support the story; do not fabricate URLs. Write a clear title, one-paragraph summary, and a careful body of at least 800 characters. Do not make personal savings, tax, legal, eligibility, or bill guarantees. Return JSON only.";

  let draft;
  try { draft = await gemini(apiKey, prompt, schema); } catch (e) { throw new Error(`Draft failed: ${e.message}`); }

  if (!CATEGORIES.includes(draft.category) || !draft.title?.trim() || !draft.summary?.trim() || !draft.content?.trim() || draft.content.trim().length < 800 || !Array.isArray(draft.source_urls)) {
    throw new Error('Gemini draft did not meet editorial requirements');
  }

  const sourceUrls = [...new Set(draft.source_urls.map((v) => v.trim()).filter(validUrl))];
  if (sourceUrls.length < 2) throw new Error('Gemini draft did not provide two valid HTTPS sources');

  // Step 2: Review draft
  const reviewSchema = {
    type: 'object', properties: {
      passed: { type: 'boolean' }, score: { type: 'integer' }, notes: { type: 'array', items: { type: 'string' } },
      title: { type: 'string' }, summary: { type: 'string' }, content: { type: 'string' },
      category: { type: 'string', enum: CATEGORIES },
    }, required: ['passed', 'score', 'notes', 'title', 'summary', 'content', 'category'], additionalProperties: false,
  };

  const reviewPrompt = `Act as an independent editor for Greener Numbers. Use Google Search grounding to cross-check the supplied URLs. Approve only if the brief is materially supported, precise, neutral, and contains no individualized financial, tax, legal, eligibility, utility-bill, or savings guarantees. Its body must be at least 800 characters. You may correct wording, but do not add unsupported facts. Return passed=false and explain why if the sources do not support publication.\n\nCATEGORY: ${draft.category}\nTITLE: ${draft.title}\nSUMMARY: ${draft.summary}\nBODY:\n${draft.content}\n\nSOURCE URLS:\n${sourceUrls.map((v) => '- ' + v).join('\n')}`;

  let review;
  try { review = await gemini(apiKey, reviewPrompt, reviewSchema); } catch (e) { throw new Error(`Review failed: ${e.message}`); }

  if (!review.passed || !Number.isInteger(review.score) || review.score < 80 || !CATEGORIES.includes(review.category) || !review.title?.trim() || !review.summary?.trim() || !review.content?.trim() || review.content.trim().length < 800) {
    throw new Error(`Gemini editorial QC rejected the brief${review.notes?.length ? ': ' + review.notes.join('; ') : ''}`);
  }

  // Step 3: Save to database
  const now = new Date().toISOString();
  const slug = `${syncKey}-${review.title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^(-|-$)/g, '').slice(0, 120);
  const contentHash = await sha(`${syncKey}|${review.content}`);

  const { data: story, error: storyError } = await db.from('site_news').upsert({
    site: SITE, sync_key: syncKey, title: review.title.trim(), slug,
    summary: review.summary.trim(), content: review.content.trim(),
    category: review.category.trim(), story_type: 'daily', status: 'published',
    is_breaking: false, source_url: sourceUrls[0], source_urls: sourceUrls,
    source_name: 'Gemini Scheduled Brief', source_release_id: syncKey,
    content_hash: contentHash, generated_by_job: 'scheduled-greener-brief',
    first_published_at: now, published_at: now, last_updated_at: now,
    qc_status: 'passed', qc_score: review.score, qc_notes: review.notes,
    editorial_model: MODEL, reviewed_at: now, original_title: draft.title, original_content: draft.content,
  }, { onConflict: 'sync_key' }).select('id, slug').single();

  if (storyError || !story) throw storyError ?? new Error('Brief save failed');

  await db.from('gemini_brief_qc_runs').insert({ site: SITE, sync_key, status: 'passed', score: review.score, notes: review.notes });

  await runEnd(id.data.id, 'success', { created: 1 }, undefined, { sync_key: syncKey });
  console.log('OK synced_key=' + syncKey + ' slug=' + story.slug);
} catch (e) {
  const msg = e.message || String(e);
  try { await db.from('gemini_brief_qc_runs').insert({ site: SITE, sync_key: 'ERROR', status: 'error', notes: [msg] }); } catch {}
  try { await db.from('cron_runs').update({ completed_at: new Date().toISOString(), status: 'failed', error_message: msg.slice(0, 2000) }).eq('id', id?.data?.id); } catch {}
  console.error('FAIL', msg);
  process.exit(1);
}

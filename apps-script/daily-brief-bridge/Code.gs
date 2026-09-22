/** Version-controlled bridge. Defaults to dry-run; do not deploy without review. */
const BRIDGE_CONFIG = Object.freeze({
  dryRun: true,
  sites: [
    { brand: 'Greener Numbers', folderId: '168w7pIZjNZyTOArAKNXbfcNJ4DBjrgsN', endpoint: 'https://greenernumbers.com/api/internal/briefs/publish' },
    { brand: 'Econ Data Tools', folderId: '1zc4Y8SscbfhNKKkwenXnLRSy4osnAww8', endpoint: 'https://econdatatools.com/api/internal/briefs/publish' },
  ],
});

function publishIncomingBriefs() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try { BRIDGE_CONFIG.sites.forEach(processSite_); } finally { lock.releaseLock(); }
}

function processSite_(site) {
  const files = DriveApp.getFolderById(site.folderId).getFilesByType(MimeType.GOOGLE_DOCS);
  while (files.hasNext()) {
    const file = files.next();
    const parsed = parseBrief_(DocumentApp.openById(file.getId()).getBody().getText());
    const fingerprint = sha256_([file.getId(), file.getLastUpdated().toISOString(), parsed.raw].join('|'));
    const prior = readAudit_(file.getId());
    if (prior && prior.fingerprint === fingerprint && prior.state !== 'error') continue;
    const errors = validateForSite_(site, parsed);
    if (errors.length) { writeAudit_(file, site, fingerprint, 'quarantine', { errors: errors }); continue; }
    const payload = buildPayload_(file, site, parsed);
    if (BRIDGE_CONFIG.dryRun) { writeAudit_(file, site, fingerprint, 'dry-run', { payloadHash: sha256_(JSON.stringify(payload)) }); continue; }
    try {
      const response = UrlFetchApp.fetch(site.endpoint, { method: 'post', contentType: 'application/json', headers: { Authorization: 'Bearer ' + requiredSecret_() }, payload: JSON.stringify(payload), muteHttpExceptions: true });
      const code = response.getResponseCode();
      if (code < 200 || code >= 300) throw new Error('HTTP ' + code + ': ' + response.getContentText().slice(0, 500));
      writeAudit_(file, site, fingerprint, 'quarantine-saved', { responseCode: code });
    } catch (error) { writeAudit_(file, site, fingerprint, 'error', { message: String(error) }); }
  }
}

function parseBrief_(raw) {
  const labels = { brand: 'Brand', title: 'Title', summary: 'Summary', category: 'Category', sources: 'Source URL(s)', content: 'Content/Body' };
  const hits = [];
  Object.keys(labels).forEach(function(key) { const m = new RegExp('(?:^|\\n)\\s*' + labels[key].replace(/[()]/g, '\\$&') + '\\s*:\\s*', 'i').exec(raw); if (m) hits.push({ key: key, start: m.index + m[0].length, labelStart: m.index }); });
  hits.sort(function(a, b) { return a.labelStart - b.labelStart; });
  const out = { raw: raw };
  hits.forEach(function(hit, index) { out[hit.key] = raw.slice(hit.start, index + 1 < hits.length ? hits[index + 1].labelStart : raw.length).trim(); });
  out.sourceUrls = String(out.sources || '').match(/https:\/\/[^\s,)>]+/g) || [];
  return out;
}

function validateForSite_(site, brief) {
  const errors = [];
  if (brief.brand !== site.brand) errors.push('Brand mismatch');
  if (!brief.title || brief.title.length < 8) errors.push('Missing/short Title');
  if (!brief.summary || brief.summary.length < 20) errors.push('Missing/short Summary');
  if (!brief.category) errors.push('Missing Category');
  if (!brief.content || brief.content.length < 120) errors.push('Missing/short Content/Body');
  if (!brief.sourceUrls.length) errors.push('No HTTPS Source URL(s)');
  return errors;
}

function buildPayload_(file, site, brief) {
  return { brand: site.brand, title: brief.title, summary: brief.summary, category: brief.category, content: brief.content, source_urls: brief.sourceUrls, publication_state: 'quarantine', published_at: file.getDateCreated().toISOString(), metadata: { drive_file_id: file.getId(), drive_file_name: file.getName(), source_folder_id: site.folderId } };
}
function requiredSecret_() { const value = PropertiesService.getScriptProperties().getProperty('BRIEF_PUBLISH_SECRET'); if (!value) throw new Error('BRIEF_PUBLISH_SECRET is not configured'); return value; }
function auditKey_(fileId) { return 'brief-audit:' + fileId; }
function readAudit_(fileId) { const value = PropertiesService.getScriptProperties().getProperty(auditKey_(fileId)); return value ? JSON.parse(value) : null; }
function writeAudit_(file, site, fingerprint, state, detail) { PropertiesService.getScriptProperties().setProperty(auditKey_(file.getId()), JSON.stringify({ fileId: file.getId(), fileName: file.getName(), brand: site.brand, folderId: site.folderId, fingerprint: fingerprint, state: state, detail: detail, at: new Date().toISOString() })); }
function sha256_(value) { return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8).map(function(b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join(''); }

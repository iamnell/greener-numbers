# Daily brief bridge

This is the reviewed source for the two-site Drive-to-Railway bridge. It routes only the two configured incoming folders. It starts in `dryRun: true`, validates required labels, quarantines malformed documents in durable Script Properties audit records, deduplicates unchanged file versions by fingerprint, and sends valid documents to the site endpoints with `publication_state: quarantine`.

Deployment is intentionally manual and out of scope for this change. Before deployment, review the folder IDs, set `BRIEF_PUBLISH_SECRET` in Script Properties, keep dry-run enabled for the first execution review, and create the time trigger only after deployment approval. A later approved canary must still go to quarantine; publishing requires separate QC evidence.

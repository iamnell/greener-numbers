---
name: greener-site-audit
description: Audit Greener Numbers production each day, compare findings with audit history, and route technical findings through the Engineer and Chief of Staff.
---

# Greener Numbers site audit

Use only for production audits of `https://greenernumbers.com`.

- Inspect the live site before drawing conclusions from the repository.
- Read `~/.hermes/Agent_Deliveries/greener-numbers-site-audits/latest.json` and `issue-history.json`; preserve issue fingerprints so unchanged findings are reported as ongoing.
- Check core routes, news freshness, metadata/canonicals, sitemap/robots, data/API behavior where credentials permit, videos, newsletter behavior without subscribing anyone, and mobile/desktop layout when browser access exists.
- Classify CRITICAL, HIGH, MEDIUM, LOW, or INFO. Include URL, evidence, likely cause, recommended fix, new/known status, and whether a safe automated fix is available.
- Do not publish, delete data, submit forms, or change credentials. Immediately route CRITICAL findings to Chief of Staff. Approved technical fixes require Engineer → Auditor → Chief verification.

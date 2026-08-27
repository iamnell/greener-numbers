# Greener Numbers Website Operations

- Production: `https://greenernumbers.com`
- Repository: `https://github.com/iamnell/greener-numbers` (`main`)
- Deployment: Vercel
- Database environment names: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

## Sources and publishing

- EIA provides the live electricity-demand and monthly residential-price displays. Reporting period is shown with each live metric; no old snapshot substitutes for an unavailable feed.
- `content_publications` joined to `content_items` is the public Greener Numbers news source. Only successful `website` publications for `greener_numbers`, sorted descending by `published_at`, appear on the homepage and `/news`.
- Editorial drafts and review records remain in shared `content_items` operations tables; drafts without a successful `content_publications` website row cannot appear on public listings.
- YouTube sync: `YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`, `YOUTUBE_UPLOADS_PLAYLIST_ID`, and `CRON_SECRET`.
- Newsletter: `newsletter_subscribers`; optional delivery uses `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID`.

## Daily audit

- Owner: Hermes **Engineer** profile, the existing Website / Web Development specialist.
- Scheduler: Hermes cron, daily at 05:45 America/Chicago.
- Check: `scripts/audit-production-site.mjs`, installed as `~/.hermes/scripts/greener-site-audit.sh`.
- History: `~/.hermes/Agent_Deliveries/greener-numbers-site-audits/` (`latest.json`, timestamped reports, `issue-history.json`).
- Escalation: Engineer reviews findings; CRITICAL issues go to Chief of Staff. Approved fixes return through Engineer and Auditor verification before resolution.

## Troubleshooting

1. Compare a finding fingerprint in `issue-history.json` before treating it as new.
2. For failed routes, check Vercel deployment and the live response before editing code.
3. For stale news, verify published/datetime-filtered `content_publications` rows and server-role query behavior.
4. For data failure, verify EIA and `EIA_API_KEY`; never restore an old hard-coded metric.
5. For failed audits, use `hermes cron runs <job-id>` and Hermes incidents; repeated failures must be escalated outside the audit job.

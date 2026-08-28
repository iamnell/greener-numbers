-- `ON CONFLICT (site, source_name, source_release_id)` cannot infer a partial
-- index. A normal unique constraint still permits multiple NULL release IDs.
drop index if exists public.site_news_source_identity_unique_idx;
alter table public.site_news
  add constraint site_news_source_identity_key unique (site, source_name, source_release_id);

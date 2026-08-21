create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text not null unique,
  title text not null,
  description text,
  thumbnail_url text,
  published_at timestamptz,
  duration text,
  youtube_url text not null,
  channel_id text,
  category text,
  status text not null default 'published' check (status in ('published', 'unlisted', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists videos_published_at_idx on public.videos (published_at desc);
create index if not exists videos_status_published_at_idx on public.videos (status, published_at desc);

alter table public.videos enable row level security;

create policy "Published videos are publicly readable"
  on public.videos for select
  to anon, authenticated
  using (status = 'published');

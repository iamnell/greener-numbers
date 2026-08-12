create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  consented_at timestamptz not null,
  source text not null default 'website',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.newsletter_subscribers enable row level security;

comment on table public.newsletter_subscribers is
  'Newsletter signups submitted through the Greener Numbers website.';

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("site-wide back-to-top component is mounted and accessible", async () => {
  const [layout, component, css] = await Promise.all([
    read("app/layout.tsx"),
    read("components/back-to-top.tsx"),
    read("app/globals.css"),
  ]);
  assert.match(layout, /BackToTop/);
  assert.match(component, /aria-label=["']Back to top/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /scrollTo/);
  assert.match(css, /back-to-top/);
});

test("videos page uses stored video records and has the requested navigation and metadata contract", async () => {
  const [header, home, page, cards, data] = await Promise.all([
    read("components/site-header.tsx"),
    read("app/page.tsx"),
    read("app/videos/page.tsx"),
    read("components/video-cards.tsx"),
    read("lib/videos.ts"),
  ]);
  assert.match(header, /Videos/);
  assert.match(home, /LatestVideos/);
  assert.match(page, /Greener Numbers Videos/);
  assert.match(page, /data-driven videos explaining/);
  assert.match(cards, /youtube_video_id/);
  assert.match(cards, /loading=["']lazy/);
  assert.match(page, /VideoObject/);
  assert.match(data, /from\("videos"\)/);
});

test("YouTube sync is protected, idempotent, and uses the uploads playlist", async () => {
  const [route, sync, migration, cron, env] = await Promise.all([
    read("app/api/cron/sync-youtube/route.ts"),
    read("lib/videos.ts"),
    read("supabase/migrations/20260820190000_create_videos.sql"),
    read("vercel.json"),
    read(".env.example"),
  ]);
  assert.match(route, /CRON_SECRET/);
  assert.match(route, /Bearer/);
  assert.match(sync, /playlistItems/);
  assert.match(sync, /["']videos["']/);
  assert.match(sync, /part: ["']snippet,contentDetails,status["']/);
  assert.match(sync, /upsert/);
  assert.match(sync, /onConflict: ["']youtube_video_id/);
  assert.match(migration, /youtube_video_id text not null unique/);
  assert.match(migration, /enable row level security/);
  assert.match(cron, /sync-youtube/);
  assert.match(cron, /"schedule":\s*"[^"]+"/); // schedule is intentionally configurable; only require the sync route to have one
  assert.match(env, /YOUTUBE_API_KEY/);
  assert.match(env, /YOUTUBE_CHANNEL_ID/);
  assert.match(env, /YOUTUBE_UPLOADS_PLAYLIST_ID/);
});

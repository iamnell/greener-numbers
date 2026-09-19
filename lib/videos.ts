import { greenerNumbersYouTube } from "./video";
import { database } from "./db";

export type VideoRecord = {
  id?: string;
  youtube_video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  published_at: string | null;
  duration: string | null;
  youtube_url: string;
  channel_id: string | null;
  category: string | null;
  status: string;
};

export type SyncSummary = {
  success: boolean;
  found: number;
  inserted: number;
  updated: number;
  skipped: number;
};

export async function getPublishedVideos(limit = 12): Promise<VideoRecord[]> {
  try {
    const { rows } = await database().query("select id,youtube_video_id,title,description,thumbnail_url,published_at,duration,youtube_url,channel_id,category,status from videos where status='published' order by published_at desc limit $1", [limit]);
    return rows as VideoRecord[];
  } catch {
    // The public site should keep rendering when Supabase is unavailable or the
    // migration has not been applied yet.
    return [];
  }
}

export function formatYouTubeDuration(value: string | undefined) {
  if (!value) return null;
  const match = value.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  if (hours) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function uploadsPlaylistId() {
  return process.env.YOUTUBE_UPLOADS_PLAYLIST_ID || greenerNumbersYouTube.uploadsPlaylistId;
}

function apiUrl(path: string, params: Record<string, string>) {
  const query = new URLSearchParams({ ...params, key: process.env.YOUTUBE_API_KEY ?? "" });
  return `https://www.googleapis.com/youtube/v3/${path}?${query.toString()}`;
}

async function youtubeFetch<T>(path: string, params: Record<string, string>): Promise<T> {
  const response = await fetch(apiUrl(path, params), { next: { revalidate: 0 } });
  const body = await response.json() as T & { error?: { message?: string } };
  if (!response.ok) throw new Error(body.error?.message || `YouTube API request failed (${response.status})`);
  return body;
}

export async function syncYouTubeVideos(): Promise<SyncSummary> {
  if (!process.env.YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY is not configured.");
  const channelId = process.env.YOUTUBE_CHANNEL_ID || greenerNumbersYouTube.channelId;
  const playlist = await youtubeFetch<{ items?: Array<{ contentDetails?: { videoId?: string }; snippet?: { channelId?: string } }> }>("playlistItems", {
    part: "contentDetails,snippet",
    playlistId: uploadsPlaylistId(),
    maxResults: "50",
  });
  if ((playlist.items ?? []).some((item) => item.snippet?.channelId && item.snippet.channelId !== channelId)) throw new Error("YouTube uploads playlist channel mismatch.");
  const ids = (playlist.items ?? []).map((item) => item.contentDetails?.videoId).filter((id): id is string => Boolean(id));
  if (!ids.length) return { success: true, found: 0, inserted: 0, updated: 0, skipped: 0 };

  const details = await youtubeFetch<{ items?: Array<{ id: string; snippet?: { title?: string; description?: string; publishedAt?: string; thumbnails?: { high?: { url?: string }; medium?: { url?: string }; default?: { url?: string } }; channelId?: string; tags?: string[] }; contentDetails?: { duration?: string }; status?: { privacyStatus?: string } }> }>("videos", {
    part: "snippet,contentDetails,status",
    id: ids.join(","),
  });
  const publicVideos = (details.items ?? []).filter((item) => item.status?.privacyStatus === "public" && item.snippet?.title && item.snippet.channelId === channelId);
  const skipped = ids.length - publicVideos.length;
  if (!publicVideos.length) return { success: true, found: ids.length, inserted: 0, updated: 0, skipped };
  const client = database();
  const { rows: existing } = await client.query("select youtube_video_id from videos where youtube_video_id = any($1)", [publicVideos.map((item) => item.id)]);
  const existingIds = new Set(existing.map((row: { youtube_video_id: string }) => row.youtube_video_id));
  const rows = publicVideos.map((item) => {
    const snippet = item.snippet!;
    const text = `${snippet.title} ${snippet.description ?? ""} ${(snippet.tags ?? []).join(" ")}`.toLowerCase();
    const category = ["electricity", "utility bills", "natural gas", "solar", "electric vehicles", "ev charging", "gasoline", "home energy", "energy efficiency", "renewable energy", "household economics"].find((topic) => text.includes(topic));
    return {
      youtube_video_id: item.id,
      title: snippet.title!,
      description: snippet.description ?? null,
      thumbnail_url: snippet.thumbnails?.high?.url ?? snippet.thumbnails?.medium?.url ?? snippet.thumbnails?.default?.url ?? null,
      published_at: snippet.publishedAt ?? null,
      duration: formatYouTubeDuration(item.contentDetails?.duration),
      youtube_url: `https://www.youtube.com/watch?v=${item.id}`,
      channel_id: snippet.channelId ?? channelId,
      category: category ?? null,
      status: "published",
      updated_at: new Date().toISOString(),
    };
  });
  for (const row of rows) await client.query("insert into videos (youtube_video_id,title,description,thumbnail_url,published_at,duration,youtube_url,channel_id,category,status,updated_at) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) on conflict (youtube_video_id) do update set title=excluded.title,description=excluded.description,thumbnail_url=excluded.thumbnail_url,published_at=excluded.published_at,duration=excluded.duration,youtube_url=excluded.youtube_url,channel_id=excluded.channel_id,category=excluded.category,status=excluded.status,updated_at=excluded.updated_at", [row.youtube_video_id,row.title,row.description,row.thumbnail_url,row.published_at,row.duration,row.youtube_url,row.channel_id,row.category,row.status,row.updated_at]);
  return { success: true, found: ids.length, inserted: rows.filter((row) => !existingIds.has(row.youtube_video_id)).length, updated: rows.filter((row) => existingIds.has(row.youtube_video_id)).length, skipped };
}

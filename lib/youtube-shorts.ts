import { unstable_cache } from "next/cache";

export type YouTubeShort = { id: string; title: string; publishedAt: string; url: string };

const decode = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

function parseFeed(xml: string): YouTubeShort[] {
  const shorts: YouTubeShort[] = [];
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const entry = match[1];
    const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const link = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1] ?? "";
    // The channel feed marks Shorts with a /shorts/ link; skip long-form uploads.
    if (!id || !link.includes("/shorts/")) continue;
    shorts.push({
      id,
      title: decode(entry.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""),
      publishedAt: entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "",
      url: `https://www.youtube.com/shorts/${id}`,
    });
  }
  return shorts;
}

const BROWSER_HEADERS = {
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
  "accept-language": "en-US,en;q=0.9",
};

async function fetchText(url: string) {
  const response = await fetch(url, { cache: "no-store", headers: BROWSER_HEADERS, signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

async function fetchFeed(channelId: string): Promise<YouTubeShort[]> {
  const shorts = parseFeed(await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`));
  if (!shorts.length) throw new Error("YouTube feed had no Shorts");
  return shorts;
}

function collectShortLockups(node: unknown, out: Record<string, unknown>[]) {
  if (Array.isArray(node)) {
    for (const item of node) collectShortLockups(item, out);
  } else if (node && typeof node === "object") {
    const record = node as Record<string, unknown>;
    if (record.shortsLockupViewModel) out.push(record.shortsLockupViewModel as Record<string, unknown>);
    else for (const value of Object.values(record)) collectShortLockups(value, out);
  }
}

/** Fallback: the channel's public Shorts tab (newest first, no publish dates). */
async function fetchShortsTab(channelUrl: string): Promise<YouTubeShort[]> {
  const html = await fetchText(`${channelUrl.replace(/\/$/, "")}/shorts`);
  const marker = "var ytInitialData = ";
  const begin = html.indexOf(marker);
  const finish = begin < 0 ? -1 : html.indexOf(";</script>", begin);
  if (begin < 0 || finish < 0) throw new Error("Shorts tab had no initial data");
  const lockups: Record<string, unknown>[] = [];
  collectShortLockups(JSON.parse(html.slice(begin + marker.length, finish)), lockups);
  const shorts: YouTubeShort[] = [];
  for (const lockup of lockups) {
    const text = JSON.stringify(lockup);
    const id = text.match(/"videoId":"([\w-]{11})"/)?.[1];
    const overlay = lockup.overlayMetadata as { primaryText?: { content?: string } } | undefined;
    const title = overlay?.primaryText?.content ?? String(lockup.accessibilityText ?? "").replace(/, [\d,.]+[KMB]? views? - play Short$/i, "");
    if (id && title && !shorts.some((short) => short.id === id)) shorts.push({ id, title, publishedAt: "", url: `https://www.youtube.com/shorts/${id}` });
  }
  if (!shorts.length) throw new Error("Shorts tab had no Shorts");
  return shorts;
}

async function loadShorts(channelId: string, channelUrl?: string): Promise<YouTubeShort[]> {
  // The RSS feed carries publish dates but YouTube returns 404 to some hosting IPs,
  // so fall back to the public Shorts tab. Throwing keeps the last good cached list.
  const errors: string[] = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await fetchFeed(channelId);
    } catch (error) {
      errors.push(String(error));
    }
    if (channelUrl) {
      try {
        return await fetchShortsTab(channelUrl);
      } catch (error) {
        errors.push(String(error));
      }
    }
  }
  console.warn(`[youtube-shorts] ${channelId}: ${errors.join(" | ")}`);
  throw new Error("No YouTube Shorts source available");
}

export async function getChannelShorts(channelId: string, limit = 6, channelUrl?: string): Promise<YouTubeShort[]> {
  try {
    const cached = unstable_cache(() => loadShorts(channelId, channelUrl), ["youtube-shorts-v2", channelId], { revalidate: 1800 });
    return (await cached()).slice(0, limit);
  } catch {
    return [];
  }
}

const STOP_WORDS = new Set("a an and are as at be by can does for from has have how in is it its more most not of on one or out over than that the their this to up us u.s vs was what when which why will with you your year years percent".split(" "));

function keywords(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/(\d),(\d)/g, "$1$2")
      .split(/[^a-z0-9.%$]+/)
      .map((word) => word.replace(/^[.]+|[.]+$/g, ""))
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
  );
}

/** Pick the Short that covers the same story: shared title keywords, published within 4 days. */
export function matchShortToStory(shorts: YouTubeShort[], story: { title: string; summary?: string | null; publishedAt?: string | null }) {
  const storyWords = keywords(`${story.title} ${story.summary ?? ""}`);
  const storyTime = story.publishedAt ? new Date(story.publishedAt).getTime() : Number.NaN;
  let best: { short: YouTubeShort; score: number } | null = null;
  for (const short of shorts) {
    // The Shorts-tab fallback has no dates and only lists recent Shorts, so treat an
    // undated Short as published now: it can only match a story from the last 4 days.
    const shortTime = short.publishedAt ? new Date(short.publishedAt).getTime() : Date.now();
    if (!Number.isNaN(storyTime) && !Number.isNaN(shortTime) && Math.abs(shortTime - storyTime) > 4 * 86400000) continue;
    let score = 0;
    for (const word of keywords(short.title)) if (storyWords.has(word)) score += /\d/.test(word) ? 2 : 1;
    if (score >= 3 && (!best || score > best.score)) best = { short, score };
  }
  return best?.short ?? null;
}

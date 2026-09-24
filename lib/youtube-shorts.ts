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

async function fetchFeed(channelId: string): Promise<YouTubeShort[]> {
  // The public channel feed is keyless but occasionally returns 404/500, so retry
  // and throw on failure: unstable_cache keeps serving the last good list instead
  // of caching an empty one.
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        const shorts = parseFeed(await response.text());
        if (shorts.length) return shorts;
      }
      lastError = new Error(`YouTube feed returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
  }
  throw lastError;
}

export async function getChannelShorts(channelId: string, limit = 6): Promise<YouTubeShort[]> {
  try {
    const cached = unstable_cache(() => fetchFeed(channelId), ["youtube-shorts", channelId], { revalidate: 1800 });
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
    const shortTime = new Date(short.publishedAt).getTime();
    if (!Number.isNaN(storyTime) && !Number.isNaN(shortTime) && Math.abs(shortTime - storyTime) > 4 * 86400000) continue;
    let score = 0;
    for (const word of keywords(short.title)) if (storyWords.has(word)) score += /\d/.test(word) ? 2 : 1;
    if (score >= 3 && (!best || score > best.score)) best = { short, score };
  }
  return best?.short ?? null;
}

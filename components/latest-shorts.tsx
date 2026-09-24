import { greenerNumbersYouTube } from "../lib/video";
import { getChannelShorts, type YouTubeShort } from "../lib/youtube-shorts";
import { LiteShort } from "./lite-short";

export function getGreenerNumbersShorts(limit = 6) {
  return getChannelShorts(greenerNumbersYouTube.channelId, limit);
}

export function ShortsGrid({ shorts }: { shorts: YouTubeShort[] }) {
  return <div className="shorts-grid">{shorts.map((short) => <LiteShort key={short.id} short={short} />)}</div>;
}

export async function LatestShorts({ limit = 4 }: { limit?: number }) {
  const shorts = await getGreenerNumbersShorts(limit);
  if (!shorts.length) return null;
  return <section className="platform-main platform-section latest-shorts" aria-labelledby="latest-shorts-heading">
    <div className="section-intro"><div><p className="eyebrow">Latest Shorts</p><h2 id="latest-shorts-heading">The numbers in under a minute.</h2></div><a href={`${greenerNumbersYouTube.channelUrl}/shorts`} target="_blank" rel="noreferrer">All Shorts on YouTube ↗</a></div>
    <ShortsGrid shorts={shorts} />
  </section>;
}

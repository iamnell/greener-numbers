import Image from "next/image";
import Link from "next/link";
import type { VideoRecord } from "../lib/videos";

function publishedLabel(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("en-US", { dateStyle: "medium" });
}

export function VideoCards({ videos }: { videos: VideoRecord[] }) {
  if (!videos.length) return <p className="video-empty">New videos will appear here after the next YouTube sync.</p>;
  return <div className="video-grid">{videos.map((video) => <article className="video-card" key={video.youtube_video_id}>
    <Link className="video-card-image" href={video.youtube_url} target="_blank" rel="noreferrer" aria-label={`Watch ${video.title} on YouTube`}>
      {video.thumbnail_url ? <Image src={video.thumbnail_url} alt="" width={640} height={360} loading="lazy" sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" /> : <span className="video-card-placeholder" aria-hidden="true">▶</span>}
      <span className="video-play" aria-hidden="true">▶</span>
    </Link>
    <div className="video-card-copy">
      <div className="video-card-meta"><span>{publishedLabel(video.published_at) ?? "Greener Numbers"}</span>{video.duration && <span>{video.duration}</span>}</div>
      <h2><Link href={video.youtube_url} target="_blank" rel="noreferrer">{video.title}</Link></h2>
      {video.description && <p>{video.description.length > 150 ? `${video.description.slice(0, 147).trimEnd()}…` : video.description}</p>}
      {video.category && <span className="video-category">{video.category}</span>}
      <Link className="button text" href={video.youtube_url} target="_blank" rel="noreferrer">Watch video ↗</Link>
    </div>
  </article>)}</div>;
}

export function LatestVideos({ videos }: { videos: VideoRecord[] }) {
  return <section className="platform-main platform-section latest-videos" aria-labelledby="latest-videos-heading">
    <div className="section-intro"><div><p className="eyebrow">Latest Videos</p><h2 id="latest-videos-heading">Useful explanations for cleaner-energy decisions.</h2></div><Link href="/videos">View all videos →</Link></div>
    <VideoCards videos={videos.slice(0, 3)} />
  </section>;
}

import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { VideoCards } from "../../components/video-cards";
import { NewsletterCTA } from "../../components/platform";
import { greenerNumbersYouTube } from "../../lib/video";
import { getPublishedVideos } from "../../lib/videos";
import { siteUrl } from "../../lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Greener Numbers Videos",
  description: "Watch data-driven videos explaining the economics of energy, utilities, electric vehicles, home efficiency, household costs, and cleaner energy.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Greener Numbers Videos",
    description: "Data-driven explainers about energy costs, utilities, EVs, home efficiency, and cleaner energy.",
    url: "/videos",
    type: "website",
  },
};

export default async function Videos() {
  const videos = await getPublishedVideos(50);
  const videoSchemas = videos.map((video) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    ...(video.description ? { description: video.description } : {}),
    ...(video.thumbnail_url ? { thumbnailUrl: [video.thumbnail_url] } : {}),
    ...(video.published_at ? { uploadDate: video.published_at } : {}),
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtube_video_id}`,
    contentUrl: video.youtube_url,
  }));
  return <><SiteHeader/><main id="main-content" className="platform-main"><section className="page-hero"><p className="eyebrow">Video hub</p><h1>Greener Numbers Videos</h1><p>Watch data-driven videos explaining the economics of energy, utilities, electric vehicles, home efficiency, household costs, and the transition to cleaner energy.</p><a className="button text" href={greenerNumbersYouTube.channelUrl} target="_blank" rel="noreferrer">Visit the YouTube channel ↗</a></section><section className="videos-list" aria-labelledby="videos-list-heading"><div className="section-intro"><div><p className="eyebrow">Latest from the channel</p><h2 id="videos-list-heading">Clear explanations, with the assumptions attached.</h2></div></div><VideoCards videos={videos}/></section><NewsletterCTA/></main><SiteFooter/>{videoSchemas.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", url: `${siteUrl}/videos`, itemListElement: videoSchemas.map((video, index) => ({ "@type": "ListItem", position: index + 1, item: video })) }) }} />}</>;
}

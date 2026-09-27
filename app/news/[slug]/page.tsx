import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAutomatedStory } from "../../../lib/data/news";
import { SiteFooter, SiteHeader } from "../../../components/site-header";
import { getGreenerNumbersShorts } from "../../../components/latest-shorts";
import { LiteShort } from "../../../components/lite-short";
import { matchShortToStory } from "../../../lib/youtube-shorts";
import { pageMetadata, siteUrl } from "../../../lib/site";

// A story can be created at any time by the scheduled publisher, so it must
// not be cached as a build-time 404.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const story = await getAutomatedStory((await params).slug);
  return story ? pageMetadata({ title: `${story.title} | Greener Numbers`, description: story.summary, path: `/news/${story.slug}`, type: "article" }) : {};
}
export default async function AutomatedNewsStory({ params }: { params: Promise<{ slug: string }> }) { const story = await getAutomatedStory((await params).slug); if (!story || !story.content) notFound(); const short = matchShortToStory(await getGreenerNumbersShorts(15), { title: story.title, summary: story.summary, publishedAt: story.published_at }); const date = new Date(story.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }); const schema = { "@context": "https://schema.org", "@type": "NewsArticle", headline: story.title, description: story.summary, mainEntityOfPage: `${siteUrl}/news/${story.slug}`, datePublished: story.published_at, dateModified: story.last_updated_at && Date.parse(story.last_updated_at) >= Date.parse(story.published_at) ? story.last_updated_at : story.published_at, author: { "@type": "Organization", name: "Greener Numbers Editorial Team", url: `${siteUrl}/authors/greener-numbers-editorial-team` }, publisher: { "@type": "Organization", name: "Greener Numbers", url: siteUrl } }; return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><SiteHeader /><main id="main-content" className="article-page"><article className="article-body"><p className="eyebrow">{story.is_breaking ? "Breaking" : story.story_type} · {story.category}</p><h1>{story.title}</h1><p className="article-dek">{story.summary}</p><p className="article-date">By Greener Numbers Editorial Team · Published {date}{story.last_updated_at ? ` · Updated ${new Date(story.last_updated_at).toLocaleDateString("en-US", { timeZone: "UTC" })}` : ""}</p>{story.content.split(/\n\n+/).map((paragraph, index) => { const heading = paragraph.match(/^#{1,6}\s+(.+)$/); return heading ? <h2 key={index}>{heading[1]}</h2> : <p key={index}>{paragraph}</p> })}<p><strong>Official source:</strong> <a href={story.source_url} target="_blank" rel="noreferrer">{story.source_name} ↗</a></p></article>{short && <aside className="story-short" aria-label="Watch the Short"><p className="eyebrow">Watch the Short</p><LiteShort short={short} /></aside>}<section className="related-content"><h2>Use the numbers</h2><Link href="/calculators/ev-charging-cost">EV Charging Cost Calculator →</Link><Link href="/calculators/ev-vs-gas">EV vs. Gas Calculator →</Link><Link href="/incentives">Energy incentives →</Link></section></main><SiteFooter /></>; }

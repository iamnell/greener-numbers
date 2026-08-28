import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAutomatedStory } from "../../../lib/data/news";
import { SiteFooter, SiteHeader } from "../../../components/site-header";

// A story can be created at any time by the scheduled publisher, so it must
// not be cached as a build-time 404.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const story = await getAutomatedStory((await params).slug); return story ? { title: `${story.title} | Greener Numbers`, description: story.summary, alternates: { canonical: `/news/${story.slug}` } } : {}; }
export default async function AutomatedNewsStory({ params }: { params: Promise<{ slug: string }> }) { const story = await getAutomatedStory((await params).slug); if (!story || !story.content) notFound(); const date = new Date(story.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }); return <><SiteHeader /><main id="main-content" className="article-page"><article className="article-body"><p className="eyebrow">{story.is_breaking ? "Breaking" : story.story_type} · {story.category}</p><h1>{story.title}</h1><p className="article-dek">{story.summary}</p><p className="article-date">Published {date}{story.last_updated_at ? ` · Updated ${new Date(story.last_updated_at).toLocaleDateString("en-US", { timeZone: "UTC" })}` : ""}</p>{story.content.split(/\n\n+/).map((paragraph, index) => paragraph.length < 75 && !paragraph.includes(".") ? <h2 key={index}>{paragraph}</h2> : <p key={index}>{paragraph}</p>)}<p><strong>Official source:</strong> <a href={story.source_url} target="_blank" rel="noreferrer">{story.source_name} ↗</a></p></article><section className="related-content"><h2>Use the numbers</h2><Link href="/calculators/ev-charging-cost">EV Charging Cost Calculator →</Link><Link href="/calculators/ev-vs-gas">EV vs. Gas Calculator →</Link><Link href="/incentives">Energy incentives →</Link></section></main><SiteFooter /></>; }

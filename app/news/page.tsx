import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { listAutomatedStories } from "../../lib/data/news";
import { formatPublishedDate, getPublishedNews } from "../../lib/news";
import { pageMetadata } from "../../lib/site";

export const metadata: Metadata = pageMetadata({ title: "Energy news | Greener Numbers", description: "Source-backed reporting on consumer-relevant energy costs, grid changes, and clean technology.", path: "/news", type: "article" });

// Editorial publications and automated official-source stories are added after
// deployment, so this route must not become a build-time snapshot.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function News() {
  const [stories, automated] = await Promise.all([getPublishedNews(), listAutomatedStories()]);

  return <><SiteHeader /><main id="main-content" className="platform-main" tabIndex={-1}>
    <section className="page-hero"><p className="eyebrow">News</p><h1>Consumer-relevant energy news.</h1><p>Source-backed reporting on data updates, grid changes, and policy developments that can matter for household energy costs.</p></section>
    <section className="platform-section"><div className="section-intro"><div><p className="eyebrow">Latest</p><h2>Facts, analysis, and limits kept separate.</h2></div><Link href="/editorial-standards">Our standards →</Link></div>
      {stories.length || automated.length ? <div className="article-cards">{stories.map((story) => <Link key={story.slug} href={`/news/${story.slug}`}><span>{story.label}</span><h3>{story.title}</h3><p>{story.description}</p><small>{story.note} · Published {formatPublishedDate(story.published_at)}</small></Link>)}{automated.map((story) => <Link href={`/news/${story.slug}`} key={story.slug}><span>{story.is_breaking ? "Breaking · " : ""}{story.category} · {formatPublishedDate(story.published_at)}</span><h3>{story.title}</h3><p>{story.summary}</p><small>{story.source_name} · Official source linked</small></Link>)}</div> : <p className="numbers-note">Published news is temporarily unavailable. We do not show drafts or an out-of-date fallback list.</p>}
    </section>
    <section className="content-sections"><section><h2>What we cover</h2><p>Electricity rates, energy inflation, utility regulation, EV and solar incentives, gasoline, natural gas, and household spending.</p></section><section><h2>What we do not cover</h2><p>Generic environmental news without a clear consumer-cost or grid-reliability connection.</p></section><section><h2>How we report</h2><p>We link primary sources, distinguish confirmed facts from analysis, and name what the evidence does not establish.</p></section></section>
  </main><SiteFooter /></>;
}

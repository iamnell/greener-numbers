import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { pageMetadata } from "../../lib/site";
import { formatPublishedDate, getPublishedNews } from "../../lib/news";

export const metadata: Metadata = pageMetadata({ title: "Energy news | Greener Numbers", description: "Source-backed reporting on consumer-relevant energy costs, grid changes, and clean technology.", path: "/news", type: "article" });

export const revalidate = 300;

export default async function News() {
  const stories = await getPublishedNews();
  return <><SiteHeader /><main id="main-content" className="platform-main" tabIndex={-1}>
    <section className="page-hero"><p className="eyebrow">News</p><h1>Consumer-relevant energy news.</h1><p>Source-backed reporting on data updates, grid changes, and policy developments that can matter for household energy costs.</p></section>
    <section className="platform-section"><div className="section-intro"><div><p className="eyebrow">Latest</p><h2>Facts, analysis, and limits kept separate.</h2></div><Link href="/editorial-standards">Our standards →</Link></div>
      {stories.length ? <div className="article-cards">{stories.map((story) => <Link key={story.slug} href={`/news/${story.slug}`}><span>{story.label}</span><h3>{story.title}</h3><p>{story.description}</p><small>{story.note} · Published {formatPublishedDate(story.published_at)}</small></Link>)}</div> : <p className="numbers-note">Published news is temporarily unavailable. We do not show drafts or an out-of-date fallback list.</p>}
    </section>
    <section className="content-sections"><section><h2>What we cover</h2><p>Electricity rates, energy inflation, utility regulation, EV and solar incentives, gasoline, natural gas, and household spending.</p></section><section><h2>What we do not cover</h2><p>Generic environmental news without a clear consumer-cost or grid-reliability connection.</p></section><section><h2>How we report</h2><p>We link primary sources, distinguish confirmed facts from analysis, and name what the evidence does not establish.</p></section></section>
  </main><SiteFooter /></>;
}

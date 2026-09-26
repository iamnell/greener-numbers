import Link from "next/link";
import { EnergyNowFallback, GridDemandChart, MonthlyResidentialPrice } from "../components/platform";
import { SiteFooter, SiteHeader } from "../components/site-header";
import { NewsletterForm } from "../components/newsletter-form";
import { LatestVideos } from "../components/video-cards";
import { eiaSources, getEnergyNowData } from "../lib/data/eia";
import { formatPublishedDate, getPublishedNews } from "../lib/news";
import { getPublishedVideos } from "../lib/videos";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [energyNow, videos, news] = await Promise.all([getEnergyNowData(), getPublishedVideos(3), getPublishedNews(4)]);
  const [lead, ...more] = news;
  return <><SiteHeader/><main id="main-content">
    <section className="platform-main platform-section" aria-labelledby="home-heading" style={{paddingTop: 68, paddingBottom: 42}}>
      <p className="eyebrow">Greener Numbers / The front page</p>
      <h1 id="home-heading" style={{font: "600 clamp(44px,5vw,72px)/1.04 var(--serif)", letterSpacing: "-.045em", margin: "0 0 18px", maxWidth: 760}}>Energy news and the numbers behind it.</h1>
      <p style={{fontSize: 18, lineHeight: 1.55, maxWidth: 650, color: "#426058"}}>Source-checked stories, useful energy data, and videos in one place.</p>
      <div className="actions"><Link className="button primary" href="/news">Read the news →</Link><Link className="button text" href="/energy-data">Explore energy data</Link></div>
    </section>
    <section className="platform-main platform-section" aria-labelledby="news-heading" style={{paddingTop: 24}}>
      <div className="section-intro"><div><p className="eyebrow">News</p><h2 id="news-heading">Latest verified stories.</h2></div><Link href="/news">All news →</Link></div>
      {lead ? <div className="article-cards"><Link href={`/news/${lead.slug}`}><span>{lead.label}</span><h3>{lead.title}</h3><p>{lead.description}</p><small>Published {formatPublishedDate(lead.published_at)}</small></Link>{more.slice(0,2).map(story=><Link href={`/news/${story.slug}`} key={story.slug}><span>{story.label}</span><h3>{story.title}</h3><p>{story.description}</p><small>Published {formatPublishedDate(story.published_at)}</small></Link>)}</div> : <p className="numbers-note">Published news is temporarily unavailable. We do not substitute a stale list.</p>}
    </section>
    <section className="platform-main platform-section" aria-labelledby="data-heading">
      <div className="section-intro"><div><p className="eyebrow">Charts &amp; data</p><h2 id="data-heading">Energy signals, with sources.</h2></div><Link href="/energy-data">All energy data →</Link></div>
      <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 24}}>
        {energyNow ? <GridDemandChart demand={energyNow.demand} updatedAt={energyNow.demandUpdatedAt} source={eiaSources.grid}/> : <EnergyNowFallback/>}
        {energyNow?.residentialPrice ? <MonthlyResidentialPrice {...energyNow.residentialPrice} source={eiaSources.retail}/> : <div className="pending-data"><h3>Residential electricity prices</h3><p>The latest monthly EIA record is temporarily unavailable. We do not substitute an older snapshot.</p><a href="https://www.eia.gov/electricity/data.php" target="_blank" rel="noreferrer">EIA source ↗</a></div>}
      </div>
      <p className="numbers-note">Grid demand is hourly; residential prices are monthly. Each measurement has its own period and source.</p>
    </section>
    {videos.length > 0 ? <LatestVideos videos={videos}/> : <section className="platform-main platform-section"><div className="section-intro"><div><p className="eyebrow">Video</p><h2>Latest explainers.</h2></div><Link href="/videos">Watch videos →</Link></div><p className="numbers-note">No verified video is available in the site feed yet.</p></section>}
    <section className="platform-main platform-section" aria-labelledby="explore-heading"><div className="section-intro"><div><p className="eyebrow">Explore</p><h2 id="explore-heading">Tools and deeper guides.</h2></div></div><div className="hub-grid"><Link href="/calculators"><p className="eyebrow">Tools</p><h3>Calculators</h3><p>Compare costs and savings using your own assumptions.</p><b>Explore →</b></Link><Link href="/guides"><p className="eyebrow">Learn</p><h3>Guides</h3><p>Energy, solar, EVs, and home efficiency.</p><b>Read →</b></Link><Link href="/energy-data"><p className="eyebrow">Sources</p><h3>Energy data</h3><p>Check the series and periods behind the stories.</p><b>Explore →</b></Link></div></section>
    <section className="newsletter" id="newsletter"><p className="eyebrow">Greener Numbers Weekly</p><h2>Energy prices. Consumer costs. The economics of going green.</h2><p>One useful email each week: data context, a clear explainer, and a tool worth using.</p><NewsletterForm/></section>
  </main><SiteFooter/></>;
}

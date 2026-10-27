import Link from "next/link";
import { EnergyNowFallback, GridDemandChart, MonthlyResidentialPrice } from "../components/platform";
import { SiteFooter, SiteHeader } from "../components/site-header";
import { NewsletterForm } from "../components/newsletter-form";
import { LatestVideos } from "../components/video-cards";
import { eiaSources, getEnergyNowData } from "../lib/data/eia";
import { tools } from "../lib/tools";
import { formatPublishedDate, getPublishedNews } from "../lib/news";
import { getPublishedVideos } from "../lib/videos";

export const revalidate = 3600;
import { categories } from "../lib/directory-data";

const featuredSections = [categories[0], categories[1], categories[2], categories[3]];

const popularTools = [...tools.slice(0, 3)];

export default async function Home() {
  const [energyNow, videos, news] = await Promise.all([
    getEnergyNowData(),
    getPublishedVideos(3),
    getPublishedNews(3),
  ]);

  // Fix: Build section cards with for-loop instead of .map() to avoid Turbopack parser issue
  const sectionCards = [];
  for (const cat of featuredSections) {
    const desc = typeof cat.description === "string" ? cat.description : String(cat.description);
    sectionCards.push(
      <Link key={cat.id} href={cat.pages[0].href}>
        <p className="eyebrow">Section . {cat.pages.length} articles</p>
        <h3>{cat.name}</h3>
        <p>{desc.slice(0, 85)}{desc.length > 85 ? "..." : ""}</p>
        <b>Browse -&gt;</b>
      </Link>
    );
  }

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="platform-hero">
          <div>
            <p className="eyebrow">The economics of going green</p>
            <h1>Make going green make financial sense.</h1>
            <p>Compare energy costs, calculate savings, and understand the economics of EVs, solar power, and home efficiency.</p>
            <div className="actions">
              <Link className="button primary" href="/calculators">Calculate your savings -&gt;</Link>
              <Link className="button text" href="/energy-data">Explore energy data</Link>
            </div>
          </div>
          {energyNow ? (
            <GridDemandChart demand={energyNow.demand} updatedAt={energyNow.demandUpdatedAt} source={eiaSources.grid} />
          ) : (
            <EnergyNowFallback />
          )}
        </section>

        {energyNow?.residentialPrice && (
          <section className="platform-main">
            <MonthlyResidentialPrice {...energyNow.residentialPrice} source={eiaSources.retail} />
          </section>
        )}

        <section className="platform-main platform-section">
          <div className="section-intro">
            <p className="eyebrow">Start with a decision</p>
            <h2>Four ways to lower or understand your energy costs.</h2>
          </div>
          <div className="hub-grid">{sectionCards}</div>

          <section className="platform-main dir-explore">
            <Link href="/directory" className="hub-grid-card dir-explore">
              <p className="eyebrow">Browse everything</p>
              <h3>Full Directory</h3>
              <p>{categories.reduce((sum, c) => sum + c.pages.length, 0)} guides, calculators, data sources, and more - organized by topic.</p>
              <b>Explore directory -&gt;</b>
            </Link>
          </section>
        </section>

        <section className="platform-main platform-section">
          <div className="section-intro">
            <p className="eyebrow">Popular calculators</p>
            <h2>Tools first. The numbers behind the decision.</h2>
            <Link href="/calculators">Explore all calculators -&gt;</Link>
          </div>
          <div className="tool-cards compact">
            {popularTools.slice(0, 4).map((tool, index) => (
              <Link href={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
                <span>{index + 1} . Calculator</span>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <b>Calculate -&gt;</b>
              </Link>
            ))}
          </div>
        </section>

        <section className="numbers-section">
          <div className="section-intro">
            <p className="eyebrow">Energy prices &amp; data</p>
            <h2>Consumer-cost context, not market noise.</h2>
            <Link href="/energy-data">Explore energy data -&gt;</Link>
          </div>
          {energyNow?.residentialPrice ? (
            <div className="number-grid">
              <Link href="/electricity">
                <span>U.S. residential electricity</span>
                <b>{(energyNow.residentialPrice.centsPerKwh).toFixed(2)}&cent;</b>
                <small>per kWh . EIA data through {energyNow.residentialPrice.period}</small>
              </Link>
            </div>
          ) : (
            <p className="numbers-note">The latest monthly EIA residential-price record is temporarily unavailable. We do not substitute an older snapshot.</p>
          )}
          <p className="numbers-note">Grid demand is hourly; residential price data is monthly. Each live measurement carries its own release period and source context.</p>
        </section>

        <section className="platform-main platform-section">
          <div className="section-intro">
            <p className="eyebrow">Latest green economy news</p>
            <h2>Useful explainers, grounded in primary sources.</h2>
            <Link href="/news">Browse news -&gt;</Link>
          </div>
          {news.length ? (
            <div className="article-cards">
              {news.map((story) => (
                <Link href={`/news/${story.slug}`} key={story.slug}>
                  <span>{story.label}</span>
                  <h3>{story.title}</h3>
                  <p>{story.description}</p>
                  <small>Published {formatPublishedDate(story.published_at)}</small>
                </Link>
              ))}
            </div>
          ) : (
            <p className="numbers-note">Published news is temporarily unavailable. We do not substitute a stale list.</p>
          )}
        </section>

        <LatestVideos videos={videos} />

        <section className="newsletter" id="newsletter">
          <p className="eyebrow">Greener Numbers Weekly</p>
          <h2>Energy prices. Consumer costs. The economics of going green.</h2>
          <p>One useful email each week: data context, a clear explainer, and a tool worth using.</p>
          <NewsletterForm />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

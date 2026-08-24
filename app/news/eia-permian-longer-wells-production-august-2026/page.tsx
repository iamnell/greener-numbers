import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { pageMetadata } from "../../../lib/site";

const eiaAnalysis = "https://www.eia.gov/todayinenergy/detail.php?id=67984";

export const metadata: Metadata = pageMetadata({ title: "Longer Permian wells helped lift oil and gas output, EIA says | Greener Numbers", description: "EIA says longer horizontal wells helped Permian oil-and-gas output rise from 2.9 million to 11.2 million barrels of oil equivalent per day between 2015 and 2025. The production measure does not establish a household fuel-price effect.", path: "/news/eia-permian-longer-wells-production-august-2026", type: "article" });

export default function EiaPermianLongerWellsNews() {
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: "Longer Permian wells helped lift oil and gas output, EIA says", description: metadata.description, datePublished: "2026-08-24", dateModified: "2026-08-24", mainEntityOfPage: "https://greenernumbers.com/news/eia-permian-longer-wells-production-august-2026", author: articleAuthorJsonLd(), publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" } };
  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">Energy markets · Natural gas · 2 min read</p>
      <h1>Longer Permian wells helped lift oil and gas output, EIA says</h1>
      <p className="article-dek">Federal energy analysts say longer horizontal wells let Permian operators reach more reservoir rock per well. The reported production growth is a regional supply measure—not a forecast of what a driver will pay at the pump or a household will pay for gas.</p>
      <ArticleByline publishedAt="2026-08-24" updatedAt="2026-08-24" />
      <p className="article-date">Educational analysis, not financial advice.</p>
      <section><h2>Confirmed facts</h2><p>The U.S. Energy Information Administration (EIA) reports that Permian-region hydrocarbon production rose from 2.9 million barrels of oil equivalent per day (BOE/d) in 2015 to 11.2 million BOE/d in 2025, a 284% increase. The region spans western Texas and eastern New Mexico.</p><p>EIA says average lateral length for a newly completed horizontal Permian well increased 77%, from 6,149 feet in 2015 to 10,867 feet in 2025, using Enverus data. Wells longer than 15,000 feet—&ldquo;super-laterals&rdquo;—accounted for 15% of new Permian completions in 2025, while wells under 5,000 feet accounted for 4%.</p><p>New horizontal completions have remained around 6,000 annually since 2022, according to the EIA analysis. Its explanation is that longer wells contact more reservoir rock while allowing operators to keep well counts and associated overhead lower.</p></section>
      <section><h2>What the figures can—and cannot—tell consumers</h2><p>More regional production can be relevant context for U.S. oil and natural-gas supply. But BOE/d combines hydrocarbons in an energy-equivalent unit; it is not a gasoline-volume measure, a delivered natural-gas volume for a particular utility, or a retail price.</p><p>Fuel and household-gas bills also depend on global crude prices, refining, transportation, storage, regional pipeline constraints, utility procurement, taxes, weather, and rate design. The EIA analysis does not estimate the effect of these drilling changes on any customer&apos;s bill or on future retail prices.</p></section>
      <section><h2>Scope and limits</h2><p>The well-length data are from Enverus, as presented by EIA. The 2025 production comparison is historical; it should not be read as a forecast. EIA notes that the 2020–21 period was atypical because negative oil prices and pandemic uncertainty curtailed activity.</p><p>This report does not characterize the environmental impacts of production or make an investment recommendation. It keeps a technical change in a major producing basin separate from downstream price outcomes.</p></section>
      <section className="source-ledger"><h2>Sources &amp; update log</h2><p><strong>Primary source:</strong> U.S. Energy Information Administration, <a href={eiaAnalysis} target="_blank" rel="noreferrer">“Longer wells boost Permian crude oil and natural gas production” ↗</a>, August 19, 2026, accessed August 24, 2026. EIA attributes well-length figures to Enverus and the production comparison to its August 2026 <em>Short-Term Energy Outlook</em>.</p><p><strong>Update log:</strong> Initial publication August 24, 2026. Production units, source attribution, and the difference between supply context and retail prices are stated explicitly.</p></section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-policy">Editorial policy</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}
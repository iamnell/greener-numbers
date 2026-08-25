import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { pageMetadata } from "../../../lib/site";

const eiaUpdate = "https://www.eia.gov/petroleum/gasdiesel/";

export const metadata: Metadata = pageMetadata({ title: "U.S. gasoline average rose 3.6¢ in EIA’s latest weekly survey | Greener Numbers", description: "EIA’s August 25 release lists the U.S. regular-gasoline average at $4.085 per gallon for the week of August 24, up 3.6 cents from a week earlier. Regional averages moved differently, and the survey is not a forecast.", path: "/news/eia-us-gasoline-diesel-prices-august-25-2026", type: "article" });

export default function EiaGasDieselPricesNews() {
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: "U.S. gasoline average rose 3.6¢ in EIA’s latest weekly survey", description: metadata.description, datePublished: "2026-08-25", dateModified: "2026-08-25", mainEntityOfPage: "https://greenernumbers.com/news/eia-us-gasoline-diesel-prices-august-25-2026", author: articleAuthorJsonLd(), publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" } };
  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">Transportation costs · Gasoline · 2 min read</p>
      <h1>U.S. gasoline average rose 3.6¢ in EIA’s latest weekly survey</h1>
      <p className="article-dek">The federal government’s latest weekly price survey puts the U.S. regular-gasoline average at $4.085 per gallon. That is a national, tax-inclusive survey average—not a quote for a particular station or a prediction of where prices go next.</p>
      <ArticleByline publishedAt="2026-08-25" updatedAt="2026-08-25" />
      <p className="article-date">Educational analysis, not financial advice.</p>
      <section><h2>Confirmed facts</h2><p>The U.S. Energy Information Administration (EIA) released its weekly Gasoline and Diesel Fuel Update on August 25. For the week ending August 24, it reports a U.S. average retail regular-gasoline price of $4.085 per gallon, including taxes. That is 3.6 cents above the prior week’s $4.049 average and 93.8 cents above the same week one year earlier.</p><p>The regional averages did not all move in the same direction. The Midwest average was $3.934 per gallon, down 0.4 cents from a week earlier; the Gulf Coast was $3.638, up 1.6 cents; and the West Coast average was $5.147, up 6.1 cents. California’s reported average was $5.450, up 5.3 cents.</p><p>EIA’s national on-highway diesel average was $5.652 per gallon, up 19.8 cents from the prior week. The gasoline and diesel series are separate survey measures; diesel is not a substitute price for a household gasoline purchase.</p></section>
      <section><h2>What the figures can—and cannot—tell consumers</h2><p>The weekly national figure is useful context for broad fuel-cost changes. Multiplying a price change by gallons purchased can show the arithmetic effect for a driver who buys the same number of gallons, but it does not account for changes in driving, vehicle efficiency, station choice, local taxes, or discounts.</p><p>Local pump prices can differ substantially from EIA’s national and regional averages. The data do not establish the price at a particular station, and the one-week movement does not predict next week’s price. Crude-oil costs, refining, distribution and marketing, taxes, supply disruptions, and local competition can all affect retail prices.</p></section>
      <section><h2>Scope and limits</h2><p>EIA identifies these as weekly retail-price averages and provides methodology and sampling-variability materials with the release. The figures include all taxes. They are not inflation-adjusted and should not be used as a household budget guarantee.</p><p>This report records the newest released survey values rather than attributing the weekly change to one cause. It makes no investment recommendation and does not estimate an effect on electricity bills, vehicle ownership costs, or future fuel prices.</p></section>
      <section className="source-ledger"><h2>Sources &amp; update log</h2><p><strong>Primary source:</strong> U.S. Energy Information Administration, <a href={eiaUpdate} target="_blank" rel="noreferrer">Gasoline and Diesel Fuel Update ↗</a>, released August 25, 2026; figures for week ending August 24, 2026; accessed August 25, 2026.</p><p><strong>Update log:</strong> Initial publication August 25, 2026. National, regional, and California regular-gasoline figures; the national diesel figure; units; tax treatment; and the distinction between observed averages and forecasts were checked against the EIA release.</p></section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-policy">Editorial policy</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}

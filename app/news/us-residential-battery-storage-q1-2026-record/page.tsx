import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { pageMetadata } from "../../../lib/site";

const acpRelease = "https://cleanpower.org/news/u-s-energy-storage-market-q1-2026-sets-records-across-sectors/";

export const metadata: Metadata = pageMetadata({ title: "Residential battery storage reached 1.3 GWh in Q1, ACP and Wood Mackenzie say | Greener Numbers", description: "ACP and Wood Mackenzie report a record 1.3 GWh of U.S. residential battery storage in Q1 2026, up 86% year over year. They say installations begun before the Section 25D credit expiration helped lift the quarter.", path: "/news/us-residential-battery-storage-q1-2026-record", type: "article" });

export default function UsResidentialBatteryStorageQ1News() {
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: "Residential battery storage reached 1.3 GWh in Q1, ACP and Wood Mackenzie say", description: metadata.description, datePublished: "2026-08-24", dateModified: "2026-08-24", mainEntityOfPage: "https://greenernumbers.com/news/us-residential-battery-storage-q1-2026-record", author: articleAuthorJsonLd(), publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" } };
  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">Home energy · Battery storage · 2 min read</p>
      <h1>Residential battery storage reached 1.3 GWh in Q1, ACP and Wood Mackenzie say</h1>
      <p className="article-dek">The industry report says U.S. residential storage deployments set a quarterly record in early 2026. Its authors also caution that installations initiated before the federal Section 25D credit expired helped buoy the result, so the single quarter is not a household-savings forecast.</p>
      <ArticleByline publishedAt="2026-08-24" updatedAt="2026-08-24" />
      <p className="article-date">Educational analysis, not financial advice.</p>
      <section><h2>Confirmed facts</h2><p>American Clean Power (ACP) and Wood Mackenzie reported that the residential segment installed a record 1.3 gigawatt-hours (GWh) of battery storage in the first quarter of 2026. Their June 23 release says this was 86% above the prior year&apos;s first quarter and 5% above the prior quarter.</p><p>The release says volumes were buoyed by installations initiated at the end of 2025 to capture the expiring Section 25D tax credit. It identifies California, Texas, Hawaii, and Arizona as the states with the largest quarter-over-quarter increases in deployed residential-storage capacity, and reports a 45% national solar-plus-storage attachment rate in Q1.</p></section>
      <section><h2>What the result does—and does not—show</h2><p>The reported 1.3 GWh is an energy-capacity measure for a market segment, not the number of homes served, a count of battery units, or a measure of electricity generated. The result supports that deployments were unusually high in Q1; it does not establish that demand will continue at that rate after the credit-related installation backlog clears.</p><p>Whether a battery is economical for an individual household depends on its installed price, usable capacity, electricity tariff and export rules, outage needs, financing, solar production, and state or utility incentives. Those inputs cannot be inferred from national deployment totals.</p></section>
      <section><h2>Outlook and limits</h2><p>ACP and Wood Mackenzie project a 5% residential contraction in 2026 despite the strong first quarter, citing tax-equity constraints and updated permitting rules. That is an industry forecast, not a measured outcome, and it may change as policy, equipment supply, and electricity prices change.</p><p>This story relies on an industry association&apos;s public release describing a paid market report. Greener Numbers did not independently inspect the report&apos;s underlying project-level data.</p></section>
      <section className="source-ledger"><h2>Sources &amp; update log</h2><p><strong>Source:</strong> American Clean Power and Wood Mackenzie, <a href={acpRelease} target="_blank" rel="noreferrer">“U.S. Energy Storage Market Q1 2026 Sets Records Across Sectors” ↗</a>, June 23, 2026, accessed August 24, 2026. The release supplies the residential capacity, growth rates, stated credit-related timing, state list, attachment rate, and outlook.</p><p><strong>Update log:</strong> Initial publication August 24, 2026. Figures are attributed to ACP/Wood Mackenzie, capacity units are kept distinct from household counts and generation, and the article does not imply a universal battery payback.</p></section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-policy">Editorial policy</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}

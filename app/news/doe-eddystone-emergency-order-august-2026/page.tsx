import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { pageMetadata } from "../../../lib/site";

const doeRelease = "https://www.energy.gov/articles/energy-secretary-keeps-critical-generation-available-mid-atlantic";

export const metadata: Metadata = pageMetadata({ title: "Breaking News: DOE order keeps Eddystone units available through November | Greener Numbers", description: "DOE says its August 21 emergency order directs PJM and Constellation to keep Eddystone Units 3 and 4 available from August 23 through November 20, 2026. The release does not quantify a customer-bill effect.", path: "/news/doe-eddystone-emergency-order-august-2026", type: "article" });

export default function DoeEddystoneEmergencyOrderNews() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "Breaking News: DOE order keeps Eddystone units available through November",
    description: metadata.description,
    datePublished: "2026-08-22",
    dateModified: "2026-08-22",
    mainEntityOfPage: "https://greenernumbers.com/news/doe-eddystone-emergency-order-august-2026",
    author: articleAuthorJsonLd(),
    publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" },
  };

  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">Breaking News · Grid reliability · 2 min read</p>
      <h1>DOE order keeps Eddystone units available through November</h1>
      <p className="article-dek">The Department of Energy says its emergency order requires PJM, working with Constellation, to keep two Eddystone generating units available from August 23 through November 20. It is an operational-reliability action, not a retail-rate decision or a household-bill estimate.</p>
      <ArticleByline publishedAt="2026-08-22" updatedAt="2026-08-22" />
      <p className="article-date">Educational analysis, not financial advice.</p>

      <section><h2>Confirmed facts</h2>
        <p>On August 21, 2026, the U.S. Department of Energy announced that the Secretary had issued an emergency order concerning Units 3 and 4 at the Eddystone Generating Station in Pennsylvania. DOE says the order directs PJM Interconnection L.L.C., in coordination with Constellation Energy Corporation, to ensure the units remain available to operate and to use economic dispatch.</p>
        <p>DOE states that the order takes effect August 23, 2026 and remains in effect through November 20, 2026. The department says the two units had been scheduled to close on May 31, 2025.</p>
      </section>

      <section><h2>Analysis</h2>
        <p>The immediate practical significance is reliability planning in the PJM region: the federal action preserves the availability of identified generation during the stated period. “Available to operate” is not the same as a finding that the units will run continuously or that they will supply any particular customer.</p>
        <p>For households and businesses, reliability actions can matter because outages impose direct costs and disrupt service. But DOE&apos;s announcement does not provide a retail-rate change, a bill impact, an operating schedule, or an allocation of any costs among customers. Those outcomes cannot be calculated from this release alone.</p>
      </section>

      <section><h2>Unknowns and limits</h2>
        <p>DOE&apos;s August 21 announcement does not state the units&apos; capacity, expected generation, fuel use, emissions, operating costs, payments, or the effect on any PJM customer&apos;s electricity bill. It also does not establish that a local utility will change its tariff.</p>
        <p>This report relies on DOE&apos;s public announcement of the order. Readers should not treat the stated availability period as a forecast of a blackout, an energy-price forecast, or a guarantee of uninterrupted service.</p>
      </section>

      <section className="source-ledger"><h2>Sources &amp; update log</h2>
        <p><strong>Primary source:</strong> U.S. Department of Energy, <a href={doeRelease} target="_blank" rel="noreferrer">“Energy Secretary Keeps Critical Generation Available in Mid-Atlantic” ↗</a>, dated August 21, 2026 and accessed August 22, 2026. It identifies the emergency action, entities, units, effective dates, and DOE&apos;s description of the direction.</p>
        <p><strong>Update log:</strong> Initial publication on August 22, 2026. Classified as Breaking News because DOE announced a time-limited emergency grid-reliability order effective August 23. The report distinguishes the announced availability direction from unreported dispatch, cost, rate, bill, and emissions outcomes.</p>
      </section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-policy">Editorial policy</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}

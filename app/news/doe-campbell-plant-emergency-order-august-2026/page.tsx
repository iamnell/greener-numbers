import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { pageMetadata } from "../../../lib/site";

const doeRelease = "https://www.energy.gov/articles/energy-secretary-keeps-coal-fired-generation-operational-midwest";

export const metadata: Metadata = pageMetadata({ title: "Breaking News: DOE orders Campbell plant availability through November | Greener Numbers", description: "DOE's August 14 emergency order directs MISO, with Consumers Energy, to keep the 1,420 MW J.H. Campbell plant available from August 17 through November 14, 2026.", path: "/news/doe-campbell-plant-emergency-order-august-2026", type: "article" });

export default function DoeCampbellEmergencyOrderNews() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "Breaking News: DOE orders Michigan's Campbell plant to remain available through November",
    description: metadata.description,
    datePublished: "2026-08-14",
    dateModified: "2026-08-14",
    mainEntityOfPage: "https://greenernumbers.com/news/doe-campbell-plant-emergency-order-august-2026",
    author: articleAuthorJsonLd(),
    publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" },
  };

  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">Breaking News · Grid reliability · 3 min read</p>
      <h1>Breaking News: DOE orders Michigan’s Campbell plant to remain available through November</h1>
      <p className="article-dek">A new federal emergency order directs MISO, working with Consumers Energy, to keep the 1,420-megawatt J.H. Campbell coal plant available to operate from August 17 through November 14. The release does not quantify an effect on any customer’s bill.</p>
      <ArticleByline publishedAt="2026-08-14" updatedAt="2026-08-14" />
      <p className="article-date">Educational analysis, not financial advice.</p>

      <section><h2>Confirmed facts</h2>
        <p>On August 14, the U.S. Department of Energy said Secretary Chris Wright issued an emergency order addressing grid-reliability issues in the Midwest. DOE says the order directs the Midcontinent Independent System Operator (MISO), in coordination with Consumers Energy, to ensure the 1,420-megawatt (MW) J.H. Campbell coal-fired power plant in West Olive, Michigan is available to operate.</p>
        <p>DOE says the order takes effect August 17, 2026 and runs through November 14, 2026. According to the department, the direction also calls for economic dispatch to minimize costs for families and businesses. The department says the plant had been scheduled to close May 31, 2025 and that it has issued subsequent orders during 2025 and 2026.</p>
      </section>

      <section><h2>Analysis</h2>
        <p>This is a consequential, time-sensitive grid action because it concerns the operating availability of a large generator in MISO during the late-summer and fall period. Availability is not the same as constant generation: DOE’s release says the order calls for the plant to be available and economically dispatched, rather than saying it must run continuously.</p>
        <p>For households and businesses in the region, the practical near-term relevance is reliability planning. The order preserves an option for grid operators; it does not by itself establish a retail-rate change, a specific outage outcome, or a dollar savings for an individual customer.</p>
      </section>

      <section><h2>Unknowns and limits</h2>
        <p>DOE’s release does not provide a forecast of generation from the plant, the cost of operating it, the cost allocation among customers, or a retail-bill impact. It also does not state how frequently MISO will dispatch the unit during the order period. Those results depend on actual system conditions, market outcomes, utility regulation, and subsequent public filings.</p>
        <p>This report relies on DOE’s August 14 release. The release describes the emergency order but does not link its full text. Greener Numbers has not inferred unreported reliability, emissions, or consumer-price effects from the order.</p>
      </section>

      <section className="source-ledger"><h2>Sources &amp; update log</h2>
        <p><strong>Primary source:</strong> U.S. Department of Energy, <a href={doeRelease} target="_blank" rel="noreferrer">“Energy Secretary Keeps Coal-Fired Generation Operational in the Midwest” ↗</a>, dated August 14, 2026. Accessed August 14, 2026. DOE identifies the order’s parties, plant capacity and location, effective dates, and stated dispatch direction.</p>
        <p><strong>Update log:</strong> Initial breaking-news publication on August 14, 2026. The article was published as an exception to the standard daily News limit because the official emergency order has immediate grid-reliability relevance. The copy distinguishes DOE’s reported order from outcomes that remain unquantified.</p>
      </section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-policy">Editorial policy</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}

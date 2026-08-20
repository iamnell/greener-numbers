import type { Metadata } from "next";
import Link from "next/link";

const doeRelease = "https://www.energy.gov/articles/energy-secretary-acts-protect-mid-atlantic-grid";
const doeOrderPage = "https://www.energy.gov/ceser/federal-power-act-section-202c-pjm-interconnection-llc-pjm-order-no-202-26-25";
const doeOrder = "https://www.energy.gov/documents/doe-order-no-202-26-25a";

export const metadata: Metadata = {
  title: "Breaking News: DOE emergency order lets PJM use Wagner Unit 4 through November | Greener Numbers",
  description: "DOE's August 19 emergency order lets PJM, working with Talen Energy, run Wagner Unit 4 in Maryland through November 17 to meet anticipated demand. It does not set a retail rate.",
  alternates: { canonical: "/news/doe-pjm-wagner-unit-4-emergency-order-august-2026" },
};

export default function DoePjmWagnerEmergencyOrderNews() {
  const published = "August 20, 2026";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "Breaking News: DOE emergency order lets PJM use Wagner Unit 4 through November",
    description: metadata.description,
    datePublished: "2026-08-20",
    dateModified: "2026-08-20",
    mainEntityOfPage: "https://greenernumbers.com/news/doe-pjm-wagner-unit-4-emergency-order-august-2026",
    publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" },
  };

  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">Breaking News · Grid reliability · 3 min read</p>
      <h1>Breaking News: DOE emergency order lets PJM use Wagner Unit 4 through November</h1>
      <p className="article-dek">A federal emergency order effective today authorizes PJM, coordinating with Talen Energy, to run Wagner Generating Station Unit 4 in Maryland through November 17 to meet anticipated demand. The order does not set a retail electricity rate or predict a customer bill.</p>
      <p className="article-date">Published {published} · Updated {published} · Educational analysis, not financial advice.</p>

      <section><h2>Confirmed facts</h2>
        <p>On August 19, the U.S. Department of Energy issued emergency Order No. 202-26-25A under Section 202(c) of the Federal Power Act. DOE says the order authorizes PJM Interconnection, L.L.C., in coordination with Talen Energy Corporation, to run Unit 4 at the Wagner Generating Station in Anne Arundel County, Maryland, to meet anticipated electricity demand.</p>
        <p>DOE states that the order is effective from August 20, 2026, through November 17, 2026. Its order page identifies this as a renewal following an earlier Wagner Unit 4 order that ran from May 22 through August 19. DOE says PJM requested the renewal to continue operating the unit beyond its then-current operating limit and told DOE it expected to need the unit during high-demand periods.</p>
      </section>

      <section><h2>Analysis</h2>
        <p>This is a time-sensitive reliability action: it preserves an operating option for the grid operator during the remainder of the summer and into the fall. The authorization concerns a specific generating unit and a defined period; it is not a finding that outages will occur, nor a direction that the unit must run continuously.</p>
        <p>For homes and businesses in PJM, the immediate relevance is grid operations rather than an announced tariff change. Whether the unit runs will depend on PJM&apos;s actual system conditions and operations during the order period.</p>
      </section>

      <section><h2>Unknowns and limits</h2>
        <p>Neither DOE&apos;s release nor its order page provides a household-bill estimate, retail-rate change, dispatch schedule, generation forecast, or allocation of operating costs among customers. This article does not infer any of those outcomes.</p>
        <p>DOE describes PJM as serving 13 states and the District of Columbia, but the order is about Wagner Unit 4&apos;s availability—not a guarantee of reliability for every customer in that footprint. Retail bills remain subject to utility tariffs, usage, state regulation, and other factors.</p>
      </section>

      <section className="source-ledger"><h2>Sources &amp; update log</h2>
        <p><strong>Primary source:</strong> U.S. Department of Energy, <a href={doeRelease} target="_blank" rel="noreferrer">“Energy Secretary Acts to Protect Mid-Atlantic Grid” ↗</a>, dated August 19, 2026 and accessed August 20, 2026. DOE identifies the order, parties, unit, location, reason, and effective period.</p>
        <p><strong>Primary order record:</strong> DOE&apos;s <a href={doeOrderPage} target="_blank" rel="noreferrer">Order No. 202-26-25 record ↗</a>, accessed August 20, 2026, links the <a href={doeOrder} target="_blank" rel="noreferrer">August 19 renewal order ↗</a> and documents the preceding order&apos;s dates.</p>
        <p><strong>Update log:</strong> Initial breaking-news publication on August 20, 2026, when the renewed order took effect. This exception to the standard daily News limit is based on an official federal emergency grid-reliability action with an active operating period. The article separates DOE&apos;s confirmed action from unreported bill, dispatch, and outage outcomes.</p>
      </section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-policy">Editorial policy</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}
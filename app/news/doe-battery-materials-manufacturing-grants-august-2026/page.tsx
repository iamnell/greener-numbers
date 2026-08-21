import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { pageMetadata } from "../../../lib/site";

const doeRelease = "https://www.energy.gov/articles/energy-department-announces-500-million-secure-americas-critical-mineral-and-battery";
const materialsGrants = "https://www.energy.gov/cmei/manufacturing/battery-materials-processing-grants";
const manufacturingGrants = "https://www.energy.gov/cmei/manufacturing/battery-manufacturing-and-recycling-grants";

export const metadata: Metadata = pageMetadata({ title: "DOE selects seven battery-materials and manufacturing projects for $500 million | Greener Numbers", description: "DOE announced $500 million for seven selected U.S. projects in battery-material processing, manufacturing, and recycling. Selections are not a consumer-price forecast or a guarantee that projects will be built.", path: "/news/doe-battery-materials-manufacturing-grants-august-2026", type: "article" });

export default function DoeBatteryMaterialsManufacturingGrantsNews() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "DOE selects seven battery-materials and manufacturing projects for $500 million",
    description: metadata.description,
    datePublished: "2026-08-21",
    dateModified: "2026-08-21",
    mainEntityOfPage: "https://greenernumbers.com/news/doe-battery-materials-manufacturing-grants-august-2026",
    author: articleAuthorJsonLd(),
    publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" },
  };

  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">Manufacturing &amp; batteries · 3 min read</p>
      <h1>DOE selects seven battery-materials and manufacturing projects for $500 million</h1>
      <p className="article-dek">The Department of Energy has selected projects in lithium and cobalt processing, battery-material recycling, electrolyte production, and battery manufacturing. The selections establish proposed federal support—not a completed factory, a vehicle-price change, or a household-bill forecast.</p>
      <ArticleByline publishedAt="2026-08-21" updatedAt="2026-08-21" />
      <p className="article-date">Educational analysis, not financial advice.</p>

      <section><h2>Confirmed facts</h2>
        <p>On August 20, 2026, the U.S. Department of Energy announced $500 million across seven selected projects in its third round of Battery Materials Processing and Battery Manufacturing and Recycling grants. DOE says the selections are intended to expand U.S. critical-mineral and material processing, battery manufacturing, and recycling capacity.</p>
        <p>DOE&apos;s program pages identify two materials-processing selections: a $100 million federal share for Waterleaf P1 HoldCo, LLC, a Lilac Solutions company, to build and operate a lithium extraction and refining facility at the Great Salt Lake&apos;s northeastern shore in Utah; and a $100 million federal share for Formation Holdings US, Inc., doing business as Jervois, for a commercial cobalt refinery at a location still to be selected.</p>
        <p>The manufacturing-and-recycling page identifies five more selections: $100 million for Nth Cycle in the southeastern United States; and $50 million each for Princeton NuEnergy in Commerce, Georgia; Arcanum Ventures at a location to be determined; Elevated Materials at a location to be determined; and Coreshell Technologies in San Leandro, California. DOE describes the projects as covering black-mass refining, cathode-material recovery, battery-grade ethylene carbonate, lithium-metal and prelithiated materials, and silicon-anode electrodes and cells.</p>
      </section>

      <section><h2>Analysis</h2>
        <p>The immediate, verified significance is industrial: DOE has selected projects across several stages of the battery supply chain, including processing and recycling as well as component and cell production. For businesses that supply, build, or buy into those chains, the announcement identifies where prospective federal support is aimed and the stated project locations where DOE provides them.</p>
        <p>For EV and stationary-storage buyers, domestic processing and manufacturing capacity can matter to long-run supply options. But a selection is an early project milestone, not evidence of a finished facility or of a retail-price change. Actual effects would depend on project execution, production volumes, market conditions, vehicle and storage demand, and other manufacturers and suppliers.</p>
      </section>

      <section><h2>Unknowns and limits</h2>
        <p>DOE&apos;s August 20 announcement does not provide a construction timetable, operating date, annual production volume, retail battery or EV price effect, electricity-rate effect, or household savings estimate for the seven selections. This article does not infer any of those outcomes.</p>
        <p>Two selected projects are listed with locations still to be determined. DOE describes the funding as selections; its release and program pages do not establish that every project will reach operation or that the stated federal shares will all be disbursed. The announcement also does not establish eligibility for a consumer tax credit or rebate.</p>
      </section>

      <section className="source-ledger"><h2>Sources &amp; update log</h2>
        <p><strong>Primary source:</strong> U.S. Department of Energy, <a href={doeRelease} target="_blank" rel="noreferrer">“Energy Department Announces $500 Million to Secure America&apos;s Critical Mineral and Battery Supply Chains” ↗</a>, dated August 20, 2026 and accessed August 21, 2026. DOE identifies the total, seven selections, program round, and covered activities.</p>
        <p><strong>Primary program records:</strong> DOE&apos;s <a href={materialsGrants} target="_blank" rel="noreferrer">Battery Materials Processing Grants page ↗</a> and <a href={manufacturingGrants} target="_blank" rel="noreferrer">Battery Manufacturing and Recycling Grants page ↗</a>, accessed August 21, 2026. The pages list the Round 3 selections, stated federal shares, locations, and DOE&apos;s project descriptions.</p>
        <p><strong>Update log:</strong> Initial publication on August 21, 2026. The story distinguishes DOE&apos;s selection and stated project scope from unreported construction, production, retail-price, tax-credit, and bill outcomes.</p>
      </section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-policy">Editorial policy</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}

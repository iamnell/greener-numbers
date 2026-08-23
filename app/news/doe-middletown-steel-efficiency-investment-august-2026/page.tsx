import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { pageMetadata } from "../../../lib/site";

const doeRelease = "https://www.energy.gov/articles/energy-department-announces-500-million-award-revitalize-american-steelmaking";

export const metadata: Metadata = pageMetadata({ title: "DOE awards $500 million for Middletown steelmaking upgrade | Greener Numbers", description: "DOE says a $500 million award will support a $1 billion modernization at Cleveland-Cliffs’ Middletown Works, including furnace-efficiency work and an on-site facility to convert process gas into electricity. The release does not establish a retail energy-price effect.", path: "/news/doe-middletown-steel-efficiency-investment-august-2026", type: "article" });

export default function DoeMiddletownSteelEfficiencyInvestmentNews() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "DOE awards $500 million for Middletown steelmaking upgrade",
    description: metadata.description,
    datePublished: "2026-08-23",
    dateModified: "2026-08-23",
    mainEntityOfPage: "https://greenernumbers.com/news/doe-middletown-steel-efficiency-investment-august-2026",
    author: articleAuthorJsonLd(),
    publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" },
  };

  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">Manufacturing &amp; energy efficiency · 3 min read</p>
      <h1>DOE awards $500 million for Middletown steelmaking upgrade</h1>
      <p className="article-dek">DOE says the award will support a $1 billion modernization at Cleveland-Cliffs’ Middletown Works in Ohio, including efficiency work on an existing coal-fired ironmaking furnace and an on-site facility to convert steel-mill process gas into electricity. It is a project-support announcement, not a retail-energy-price forecast.</p>
      <ArticleByline publishedAt="2026-08-23" updatedAt="2026-08-23" />
      <p className="article-date">Educational analysis, not financial advice.</p>

      <section><h2>Confirmed facts</h2>
        <p>On August 21, 2026, the U.S. Department of Energy announced a $500 million award to support a $1 billion investment at Cleveland-Cliffs’ Middletown Works in Middletown, Ohio. DOE says the investment will modernize steelmaking operations, protect 2,300 American jobs, and strengthen domestic steel production.</p>
        <p>DOE says the project will rebuild and upgrade the plant’s main coal-fired ironmaking furnace, use artificial intelligence to optimize furnace operations and improve energy efficiency, and build an on-site facility that converts steel-mill process gases into electricity. The department also says follow-on investments will turn industrial byproducts into materials for regional-infrastructure concrete.</p>
        <p>DOE identifies automotive, heating and cooling, appliance, and steel-distribution industries among the domestic industries supplied by the facility. It says construction is expected to begin in the coming weeks.</p>
      </section>

      <section><h2>Analysis</h2>
        <p>The immediate documented effect is a planned industrial investment at one Ohio facility, with an energy-efficiency and on-site electricity-generation component. For businesses in the named manufacturing supply chains, the announcement identifies a federal-supported effort intended to maintain domestic steel production and improve operations at Middletown Works.</p>
        <p>Converting process gas into electricity and optimizing furnace operations may affect the facility’s own energy use and operations, but DOE does not quantify either effect. The release supports reporting the project scope and stated employment figure; it does not support a conclusion about a customer’s utility bill, an electricity rate, a national steel price, or the project’s emissions outcome.</p>
      </section>

      <section><h2>Unknowns and limits</h2>
        <p>DOE’s release does not state the project’s expected electricity output, energy savings, emissions change, construction completion date, steel-production volume, or final cost. It also does not say how much of the $500 million award has been disbursed or provide a retail-energy or appliance-price effect.</p>
        <p>The announcement describes a planned modernization of an existing coal-fired ironmaking furnace. It does not establish that the facility has changed its fuel use, that process gas is already being converted to electricity, or that the work will produce a particular consumer, grid, or climate outcome.</p>
      </section>

      <section className="source-ledger"><h2>Sources &amp; update log</h2>
        <p><strong>Primary source:</strong> U.S. Department of Energy, <a href={doeRelease} target="_blank" rel="noreferrer">“Energy Department Announces $500 Million Award to Revitalize American Steelmaking” ↗</a>, dated August 21, 2026 and accessed August 23, 2026. DOE identifies the award, total investment, facility, project scope, stated job figure, supply-chain context, and expected construction timing.</p>
        <p><strong>Update log:</strong> Initial publication on August 23, 2026. This standard News article distinguishes DOE’s announced award and stated project scope from unreported electricity output, energy savings, retail-price, rate, production, and emissions outcomes.</p>
      </section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-policy">Editorial policy</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}
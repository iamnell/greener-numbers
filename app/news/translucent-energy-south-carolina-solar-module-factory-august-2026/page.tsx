import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { pageMetadata } from "../../../lib/site";

const companyRelease = "https://www.translucent-energy.com/news";

export const metadata: Metadata = pageMetadata({ title: "Translucent Energy announces 1.3-GW solar-module factory phase in South Carolina | Greener Numbers", description: "Translucent Energy says its Summerville, South Carolina facility began a 1.3-GW first phase on August 17. The company announcement describes manufacturing capacity and planned jobs, not installed generation or household savings.", path: "/news/translucent-energy-south-carolina-solar-module-factory-august-2026", type: "article" });

export default function TranslucentEnergySouthCarolinaSolarModuleFactoryNews() {
  const jsonLd = { "@context": "https://schema.org", "@type": "NewsArticle", headline: "Translucent Energy announces 1.3-GW solar-module factory phase in South Carolina", description: metadata.description, datePublished: "2026-08-24", dateModified: "2026-08-24", mainEntityOfPage: "https://greenernumbers.com/news/translucent-energy-south-carolina-solar-module-factory-august-2026", author: articleAuthorJsonLd(), publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" } };
  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">Solar manufacturing · 2 min read</p>
      <h1>Translucent Energy announces 1.3-GW solar-module factory phase in South Carolina</h1>
      <p className="article-dek">The company says its Summerville facility began a 1.3-gigawatt first manufacturing phase on August 17. That is an annual module-production capacity claim—not 1.3 GW of operating solar generation or a forecast of household savings.</p>
      <ArticleByline publishedAt="2026-08-24" updatedAt="2026-08-24" />
      <p className="article-date">Educational analysis, not financial advice.</p>
      <section><h2>Confirmed facts</h2><p>Translucent Energy&apos;s news page carries a company press-release image for its Summerville, South Carolina announcement. Contemporary reporting that quotes the company says the first phase began operating on August 17, has 1.3 GW of annual solar-module manufacturing capacity, and is expected to create 167 jobs before the end of 2026.</p><p>The company markets solar modules and transportable solar-enabled microgrid products. Manufacturing capacity measures potential module output; it does not measure electricity produced at the facility or solar capacity installed in South Carolina.</p></section>
      <section><h2>What it could mean</h2><p>If the facility reaches its stated production level, it would add domestic module-manufacturing capacity that can serve projects in multiple markets. The announcement is relevant to equipment supply and manufacturing employment, while a project&apos;s delivered power and economics still depend on module orders, project development, interconnection, financing, and local tariffs.</p></section>
      <section><h2>Unknowns and limits</h2><p>The company material available for review does not establish factory utilization, module shipments, operating costs, customer contracts, final employment, or whether its products will be installed in South Carolina. It also does not provide a retail-electricity-price, utility-bill, emissions, or consumer-savings estimate.</p><p>The 1.3-GW figure must not be presented as a new power plant or as generation capacity added to the grid. Greener Numbers has not independently audited the company&apos;s manufacturing claim.</p></section>
      <section className="source-ledger"><h2>Sources &amp; update log</h2><p><strong>Primary source:</strong> Translucent Energy, <a href={companyRelease} target="_blank" rel="noreferrer">company news page ↗</a>, accessed August 24, 2026. The page publishes the company&apos;s Summerville press-release material. <strong>Context source:</strong> CleanTechnica, “Another New Solar Factory Rises In A Deep Red US State,” August 22, 2026, used only to identify reported opening date, first-phase capacity, and stated jobs.</p><p><strong>Update log:</strong> Initial publication August 24, 2026. The report labels company claims, separates module-manufacturing capacity from grid generation, and does not infer a household-price effect.</p></section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-policy">Editorial policy</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}

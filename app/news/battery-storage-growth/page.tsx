import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { RelatedTools } from "../../../components/related-tools";
import { pageMetadata } from "../../../lib/site";

const source = "https://www.eia.gov/todayinenergy/detail.php?id=67925";
const steo = "https://www.eia.gov/outlooks/steo/";

export const metadata: Metadata = pageMetadata({ title: "U.S. battery storage reached nearly 52 GW by June | Greener Numbers", description: "EIA says U.S. nameplate battery storage capacity approached 52 gigawatts in June 2026. What that measures—and what it does not mean for a household bill.", path: "/news/battery-storage-growth", type: "article" });

export default function BatteryStorageGrowthNews() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "U.S. battery storage reached nearly 52 GW by June. That is grid capacity—not a household-bill forecast.",
    description: metadata.description,
    datePublished: "2026-08-12",
    dateModified: "2026-08-12",
    mainEntityOfPage: "https://greenernumbers.com/news/battery-storage-growth",
    author: articleAuthorJsonLd(),
    publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" },
  };

  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">News · Grid & storage · 4 min read</p>
      <h1>U.S. battery storage reached nearly 52 GW by June. That is grid capacity—not a household-bill forecast.</h1>
      <p className="article-dek">The EIA’s latest generator inventory shows rapid growth in utility-scale battery storage. The figure helps explain a changing power grid, but it does not by itself show what any household will pay for electricity.</p>
      <ArticleByline publishedAt="2026-08-12" updatedAt="2026-08-12" />
      <p className="article-date">Educational analysis, not financial advice.</p>

      <section><h2>Confirmed facts</h2>
        <p>The U.S. power system had 43.6 gigawatts (GW) of operational battery storage capacity at the end of 2025, according to the U.S. Energy Information Administration. Operators added 8.3 GW in the first six months of 2026, bringing nameplate battery-storage capacity to nearly 52 GW in June.</p>
        <p>EIA describes that as an average annual growth rate of 70% over the preceding three years. The agency’s figure is based on its Preliminary Monthly Electric Generator Inventory and refers to utility-scale nameplate power capacity.</p>
        <p>Looking ahead, EIA reports that operators plan to bring 54 GW of additional battery capacity online over the next two and a half years: 14 GW planned for the second half of 2026, 26 GW in 2027, and 14 GW in 2028. These are reported plans, not completed projects.</p>
      </section>

      <section><h2>What the number means</h2>
        <p>A battery’s power capacity, measured in GW or MW, describes how much electricity it can deliver at a given moment. It is not the same as energy capacity, usually measured in gigawatt-hours, which describes how long it can deliver that power. A power-capacity headline alone therefore cannot tell readers how long the installed fleet can supply a given load.</p>
        <p>More storage can help grid operators shift electricity across hours, support reliability, and integrate generation whose output changes with weather. But capacity additions do not automatically translate into lower retail rates or lower monthly bills. Those outcomes also depend on utility regulation, local generation and transmission costs, market rules, fuel prices, demand, and how projects are financed and operated.</p>
      </section>

      <section><h2>Unknowns and limits</h2>
        <p>EIA’s planned additions are not guarantees: project timing, interconnection, permitting, equipment, financing, and construction can change. The national total also does not identify the effect on an individual utility territory or customer rate plan.</p>
        <p>This report does not make a prediction about electricity prices, investment returns, or whether a household should purchase a battery. For a local decision, use the utility’s tariff, available program terms, installed-cost quote, and a location-specific production and outage-resilience analysis.</p>
      </section>

      <section className="source-ledger"><h2>Sources & update log</h2>
        <p><strong>Primary source:</strong> EIA’s August 7, 2026 <a href={source} target="_blank" rel="noreferrer">Today in Energy release on battery storage capacity ↗</a>. Accessed August 12, 2026.</p>
        <p><strong>Related official context:</strong> EIA’s <a href={steo} target="_blank" rel="noreferrer">August 2026 Short-Term Energy Outlook ↗</a>, which contains EIA’s current electricity, natural-gas, and renewable-generation forecast context.</p>
        <p><strong>Update log:</strong> Initial publication on August 12, 2026. Claims are limited to the named EIA release; planned capacity is explicitly labeled as planned, not operating.</p>
      </section>
      <RelatedTools topic="grid" />
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-standards">Editorial standards</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}

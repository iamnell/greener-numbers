import type { Metadata } from "next";
import Link from "next/link";
import { ArticleByline, articleAuthorJsonLd } from "../../../lib/editorial";
import { pageMetadata } from "../../../lib/site";

const source = "https://www.eia.gov/todayinenergy/detail.php?id=67926";
const data = "https://www.eia.gov/electricity/annual/";

export const metadata: Metadata = pageMetadata({ title: "Puerto Rico outage duration rose 19% in 2025 | Greener Numbers", description: "EIA reports that Puerto Rico customers experienced 36 hours of non-major-event outages on average in 2025, 19% more than in 2024.", path: "/news/puerto-rico-outage-duration-2025", type: "article" });

export default function PuertoRicoOutageDurationNews() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "Puerto Rico’s average non-major-event outage duration rose 19% in 2025.",
    description: metadata.description,
    datePublished: "2026-08-13",
    dateModified: "2026-08-13",
    mainEntityOfPage: "https://greenernumbers.com/news/puerto-rico-outage-duration-2025",
    author: articleAuthorJsonLd(),
    publisher: { "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com" },
  };

  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/news">News</Link></header>
    <article className="article-body">
      <p className="eyebrow">News · Grid reliability · 4 min read</p>
      <h1>Puerto Rico’s average non-major-event outage duration rose 19% in 2025.</h1>
      <p className="article-dek">EIA’s early 2025 reliability data show that outages outside major events remained far longer in Puerto Rico than the mainland-U.S. benchmark. The measure describes service interruptions, not a customer’s bill or the cause of every outage.</p>
      <ArticleByline publishedAt="2026-08-13" updatedAt="2026-08-13" />
      <p className="article-date">Educational analysis, not financial advice.</p>

      <section><h2>Confirmed facts</h2>
        <p>Puerto Rico electricity customers experienced an average of 36 hours of non-momentary power interruptions not caused by major events in 2025, according to the U.S. Energy Information Administration’s August 10 release. EIA says that was 19% more than in 2024.</p>
        <p>For 2021 through 2025, Puerto Rico customers averaged 29 hours of non-major-event power loss a year. EIA says mainland-U.S. customers generally experience about two hours a year without major events.</p>
        <p>EIA separately reports 23 additional hours of interruption associated with major events in Puerto Rico in 2025. It says the annual frequency of interruptions excluding major-event days had doubled since 2021 and increased 13% from 2024 to 2025; the average customer experienced almost 16 interruptions in 2025.</p>
      </section>

      <section><h2>Analysis</h2>
        <p>Reliability is a direct household and business cost issue even when an outage metric is not a price measure. Longer or more frequent interruptions can disrupt refrigeration, communications, work, school, medical equipment, and business operations. The figures make routine-service reliability—not only hurricane resilience—a material part of Puerto Rico’s electricity decision context.</p>
        <p>The release distinguishes normal-operation performance from major events using the System Average Interruption Duration Index (SAIDI). That distinction matters: a system can face storm-driven disruption and also have reliability problems on days that do not meet EIA’s major-event threshold.</p>
      </section>

      <section><h2>Unknowns and limits</h2>
        <p>SAIDI is an average duration across customers; it does not show the experience at a particular address, feeder, utility rate class, or during a particular outage. The interruption-frequency measure is likewise an average, not a count guaranteed for an individual customer.</p>
        <p>This release does not establish what caused every interruption, predict future reliability, or quantify a customer’s financial loss. It also does not show whether any future grid investment will change rates or outage duration. Customers evaluating backup power should use local utility information, program rules, electrical-safety guidance, and a qualified installer rather than infer a system size from these averages.</p>
      </section>

      <section className="source-ledger"><h2>Sources & update log</h2>
        <p><strong>Primary source:</strong> EIA’s August 10, 2026 <a href={source} target="_blank" rel="noreferrer">Today in Energy release on Puerto Rico outage duration ↗</a>. Accessed August 13, 2026. EIA identifies its source as the Annual Electric Power Industry Report early-release reliability data.</p>
        <p><strong>Dataset context:</strong> EIA’s <a href={data} target="_blank" rel="noreferrer">Annual Electric Power Industry Report ↗</a>. The release defines SAIDI as the total duration of non-momentary interruptions experienced by an average customer in one year and identifies major-event days using the IEEE 1366 threshold framework.</p>
        <p><strong>Update log:</strong> Initial publication on August 13, 2026. Figures and definitions were checked against EIA’s named August 10 release; the article separates reported reliability metrics from implications and does not project bills or future outage performance.</p>
      </section>
    </article>
    <footer className="compact-footer"><Link href="/news">← More Greener Numbers News</Link><Link href="/editorial-standards">Editorial standards</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}
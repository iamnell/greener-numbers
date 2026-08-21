import type { Metadata } from "next";
import Link from "next/link";
import { editorialAuthor, editorialCoverage } from "../../../lib/editorial";
import { SiteFooter, SiteHeader } from "../../../components/site-header";

export const metadata: Metadata = {
  title: "Greener Numbers Editorial Team | Greener Numbers",
  description: editorialAuthor.description,
  alternates: { canonical: "/authors/greener-numbers-editorial-team" },
};

export default function EditorialTeamAuthorPage() {
  return <><SiteHeader /><main id="main-content" className="platform-main" tabIndex={-1}>
    <section className="page-hero"><p className="eyebrow">Author profile</p><h1>{editorialAuthor.name}</h1><p>{editorialAuthor.description}</p></section>
    <section className="platform-section"><div className="section-intro"><div><p className="eyebrow">Areas of coverage</p><h2>Energy economics, explained with authoritative data.</h2></div></div><div className="hub-grid">{editorialCoverage.map((area) => <div key={area}><h3>{area}</h3></div>)}</div></section>
    <section className="content-sections"><section><h2>How we work</h2><p>We separate confirmed facts, analysis, and unknowns. News and Data Briefs link to the underlying government, regulatory, utility, or other authoritative source.</p></section><section><h2>Methodology</h2><p>Greener Numbers may use automated tools for source monitoring, public-data retrieval, development identification, summarization, drafting, and data updates. Those tools do not replace source traceability or editorial accountability.</p><Link href="/editorial-policy">Read the editorial policy →</Link></section><section><h2>Corrections</h2><p>If a material error is identified, we update the affected article and explain the correction or revision in the article’s update record.</p><Link href="/corrections-policy">Corrections policy →</Link></section></section>
  </main><SiteFooter /></>;
}

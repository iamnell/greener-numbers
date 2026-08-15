import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-header";

export const metadata: Metadata = {
  title: "Energy news | Greener Numbers",
  description: "Source-backed reporting on consumer-relevant energy costs, grid changes, and clean technology.",
  alternates: { canonical: "/news" },
};

export default function News() {
  return <><SiteHeader /><main id="main-content" className="platform-main" tabIndex={-1}>
    <section className="page-hero"><p className="eyebrow">News</p><h1>Consumer-relevant energy news.</h1><p>Source-backed reporting on data updates, grid changes, and policy developments that can matter for household energy costs.</p></section>
    <section className="platform-section"><div className="section-intro"><div><p className="eyebrow">Latest</p><h2>Facts, analysis, and limits kept separate.</h2></div><Link href="/editorial-standards">Our standards →</Link></div>
      <div className="article-cards"><Link href="/news/doe-campbell-plant-emergency-order-august-2026"><span>Breaking News · Grid reliability · August 14, 2026</span><h3>DOE orders Michigan’s Campbell plant to remain available through November.</h3><p>What the emergency direction to MISO covers—and what it does not establish about a customer’s bill.</p><small>1 primary source · Facts, analysis, and limits separated</small></Link><Link href="/news/eia-2026-gasoline-price-forecast"><span>Transportation costs · August 14, 2026</span><h3>EIA forecasts a $3.78 average U.S. gasoline price for 2026.</h3><p>What the national annual outlook can—and cannot—say about a driver’s next fill-up or vehicle costs.</p><small>1 primary source · Facts, analysis, and limits separated</small></Link><Link href="/news/puerto-rico-outage-duration-2025"><span>Grid reliability · August 13, 2026</span><h3>Puerto Rico’s average non-major-event outage duration rose 19% in 2025.</h3><p>What EIA’s reliability metrics measure—and what they cannot show about an individual customer’s service or bill.</p><small>1 primary source · Facts, analysis, and limits separated</small></Link><Link href="/news/battery-storage-growth"><span>Grid & storage · August 12, 2026</span><h3>U.S. battery storage reached nearly 52 GW by June.</h3><p>What EIA’s reported capacity growth measures—and why it is not a household-bill forecast.</p><small>1 primary source · Facts, analysis, and limits separated</small></Link></div>
    </section>
    <section className="content-sections"><section><h2>What we cover</h2><p>Electricity rates, energy inflation, utility regulation, EV and solar incentives, gasoline, natural gas, and household spending.</p></section><section><h2>What we do not cover</h2><p>Generic environmental news without a clear consumer-cost or grid-reliability connection.</p></section><section><h2>How we report</h2><p>We link primary sources, distinguish confirmed facts from analysis, and name what the evidence does not establish.</p></section></section>
  </main><SiteFooter /></>;
}

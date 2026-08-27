import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { pageMetadata } from "../../lib/site";

export const metadata: Metadata = pageMetadata({ title: "Energy news | Greener Numbers", description: "Source-backed reporting on consumer-relevant energy costs, grid changes, and clean technology.", path: "/news", type: "article" });

const stories = [
  { href: "/news/eia-august-2026-electricity-renewables", label: "Electricity & renewables · August 27, 2026", title: "EIA: solar, hydropower, and wind generation all grew in the first half of 2026.", description: "What EIA's national generation data establish—and why those figures do not predict an individual utility bill.", note: "Primary federal outlook · Facts and limits separated" },
  { href: "/news/eia-us-gasoline-diesel-prices-august-25-2026", label: "Transportation costs · Gasoline · August 25, 2026", title: "U.S. gasoline average rose 3.6¢ in EIA’s latest weekly survey.", description: "EIA reports a $4.085-per-gallon national regular-gasoline average for the week ending August 24; regional averages moved differently.", note: "Primary federal data · Observed prices, not a forecast" },
  { href: "/news/eia-record-natural-gas-production-2026", label: "Natural gas · August 18, 2026", title: "EIA forecasts record U.S. natural-gas production in 2026.", description: "What the national supply forecast establishes—and why it cannot set a household gas or electricity bill.", note: "Primary federal analysis · Facts and limits separated" },
  { href: "/news/eia-2026-gasoline-price-forecast", label: "Transportation costs · August 14, 2026", title: "EIA forecasts a $3.78 average U.S. gasoline price for 2026.", description: "What the national annual outlook can—and cannot—say about a driver's next fill-up or vehicle costs.", note: "Primary federal outlook · Facts and limits separated" },
  { href: "/news/doe-campbell-plant-emergency-order-august-2026", label: "Breaking News · Grid reliability · August 14, 2026", title: "DOE orders Michigan’s Campbell plant to remain available through November.", description: "What the emergency direction to MISO covers—and what it does not establish about a customer’s bill.", note: "1 primary source · Facts, analysis, and limits separated" }
];

export default function News() {
  return <><SiteHeader /><main id="main-content" className="platform-main" tabIndex={-1}>
    <section className="page-hero"><p className="eyebrow">News</p><h1>Consumer-relevant energy news.</h1><p>Source-backed reporting on data updates, grid changes, and policy developments that can matter for household energy costs.</p></section>
    <section className="platform-section"><div className="section-intro"><div><p className="eyebrow">Latest</p><h2>Facts, analysis, and limits kept separate.</h2></div><Link href="/editorial-standards">Our standards →</Link></div>
      <div className="article-cards">{stories.map((story) => <Link key={story.href} href={story.href}><span>{story.label}</span><h3>{story.title}</h3><p>{story.description}</p><small>{story.note}</small></Link>)}</div>
    </section>
    <section className="content-sections"><section><h2>What we cover</h2><p>Electricity rates, energy inflation, utility regulation, EV and solar incentives, gasoline, natural gas, and household spending.</p></section><section><h2>What we do not cover</h2><p>Generic environmental news without a clear consumer-cost or grid-reliability connection.</p></section><section><h2>How we report</h2><p>We link primary sources, distinguish confirmed facts from analysis, and name what the evidence does not establish.</p></section></section>
  </main><SiteFooter /></>;
}

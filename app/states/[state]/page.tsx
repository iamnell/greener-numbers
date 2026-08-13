import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "../../../components/site-header";
import { Breadcrumbs, DataMeta, MethodologyBox, NewsletterCTA } from "../../../components/platform";
import { dataStatus, stateMetrics } from "../../../lib/data/energy";

type Props = { params: Promise<{ state: string }> };
const publishedStates = stateMetrics.filter((state) => state.rate !== undefined);

export function generateStaticParams() { return publishedStates.map(({ slug }) => ({ state: slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { state: slug } = await params; const state = publishedStates.find((item) => item.slug === slug); return state ? { title: `${state.name} energy costs | Greener Numbers`, description: `Source-labeled electricity-cost context and related consumer energy calculators for ${state.name}.`, alternates: { canonical: `/states/${slug}` } } : {}; }

export default async function StatePage({ params }: Props) {
  const { state: slug } = await params; const state = publishedStates.find((item) => item.slug === slug); if (!state || state.rate === undefined || state.bill === undefined) notFound();
  return <><SiteHeader /><main id="main-content" className="platform-main"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Energy Data", href: "/energy-data" }, { label: state.name }]} /><section className="page-hero"><p className="eyebrow">State energy economics</p><h1>{state.name} energy costs, with the limits visible.</h1><p>Use the published electricity snapshot as context for your own bill. It is not a utility tariff, gasoline-price feed, solar quote, or personalized incentive estimate.</p><Link className="button primary" href="/calculators/ev-charging-cost">Calculate EV charging cost →</Link></section><section className="number-grid"><div><span>Residential electricity price</span><b>{state.rate}¢</b><small>per kWh · source-labeled snapshot</small></div><div><span>Average monthly bill</span><b>${state.bill}</b><small>where published by the source</small></div><div><span>Year-over-year price change</span><b>{state.change}%</b><small>launch snapshot</small></div></section><section className="related-content"><h2>Apply this state context</h2><Link href="/tools/electricity-bill-calculator">Electricity Bill Calculator →</Link><Link href="/calculators/ev-vs-gas">EV vs. Gas Calculator →</Link><Link href="/incentives">Find incentives →</Link></section><MethodologyBox title="What this page does not estimate"><p>Gasoline economics, solar production, utility programs, and state eligibility rules need their own verified dataset. We do not infer them from an electricity-price average.</p></MethodologyBox><DataMeta source={dataStatus.source} updated={dataStatus.updated}><p>Only states with a verified launch snapshot receive a state landing page. More pages will be added when data coverage can support a useful consumer decision.</p></DataMeta><NewsletterCTA /></main><SiteFooter /></>;
}

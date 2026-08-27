import type { Metadata } from "next";
import Link from "next/link";
import { DataMeta, EnergyNowFallback, GridDemandChart, MonthlyResidentialPrice, NewsletterCTA } from "../../components/platform";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { eiaSources, getEnergyNowData } from "../../lib/data/eia";
import { dataStatus, stateMetrics } from "../../lib/data/energy";
import { pageMetadata } from "../../lib/site";

export const revalidate = 3600;
export const metadata: Metadata = pageMetadata({ title: "Electricity prices and bills | Greener Numbers", description: "Understand residential electricity prices, household bills, state differences, and the inputs behind an electricity bill.", path: "/electricity" });

export default async function Electricity() {
  const energyNow = await getEnergyNowData();
  return <><SiteHeader /><main id="main-content" className="platform-main"><section className="page-hero"><p className="eyebrow">Electricity</p><h1>Understand what is driving your electricity cost.</h1><p>Explore rates, bills, state comparisons, and the difference between an average retail price and the tariff on your own utility bill.</p><div className="actions"><Link className="button primary" href="/tools/electricity-bill-calculator">Calculate your bill →</Link><Link className="button text" href="/energy-data">Explore live energy data</Link></div></section>{energyNow ? <GridDemandChart demand={energyNow.demand} updatedAt={energyNow.demandUpdatedAt} source={eiaSources.grid} /> : <EnergyNowFallback />}{energyNow?.residentialPrice && <MonthlyResidentialPrice {...energyNow.residentialPrice} source={eiaSources.retail} />}<section className="state-preview"><div><p className="eyebrow">State comparison</p><h2>Electricity prices differ by state—and so do bills.</h2><p>State-page routes are ready for source-backed records. We do not display state rates, bills, or year-over-year changes until their verified refresh is available.</p></div><div>{stateMetrics.filter((state) => ["california", "florida", "texas"].includes(state.slug)).map((state) => <Link href={`/electricity-prices/${state.slug}`} key={state.slug}><span>{state.name}</span><b>Data pending</b><small>Source-backed state metrics will appear after verification.</small></Link>)}</div></section><DataMeta source={dataStatus.source} updated={dataStatus.updated}><p>Hourly grid demand and monthly residential prices use distinct EIA datasets and update schedules. A price average is not a real-time tariff or individual utility bill.</p></DataMeta><NewsletterCTA /></main><SiteFooter /></>;
}

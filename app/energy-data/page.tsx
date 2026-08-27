import type { Metadata } from "next";
import Link from "next/link";
import { EnergyNowFallback, GridDemandChart, MonthlyResidentialPrice, DataMeta, NewsletterCTA } from "../../components/platform";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { eiaSources, getEnergyNowData } from "../../lib/data/eia";
import { dataStatus } from "../../lib/data/energy";
import { pageMetadata } from "../../lib/site";

export const revalidate = 3600;
export const metadata: Metadata = pageMetadata({ title: "Energy data | Greener Numbers", description: "Explore transparent consumer energy data hubs for electricity, gasoline, natural gas, solar, EV costs and household energy spending.", path: "/energy-data" });
const areas = [["Electricity Prices", "Residential rates, bills, state comparisons and explanations.", "/electricity"], ["Gasoline Prices", "Consumer fuel-cost context is added only when an attributable, current source is available.", "/guides"], ["Natural Gas Prices", "Household heating and energy-spending context, with source and release timing kept visible.", "/home-energy"], ["Solar Economics", "Payback concepts, system-cost context and transparent assumptions.", "/solar"], ["EV Costs", "Fuel cost, charging and cost-per-mile explainers.", "/ev"], ["State Energy Data", "State-page architecture is in place; rates appear only after verified data is refreshed.", "/electricity"]];

export default async function EnergyData() {
  const energyNow = await getEnergyNowData();
  return <><SiteHeader /><main id="main-content" className="platform-main"><section className="page-hero"><p className="eyebrow">Energy Data</p><h1>Consumer energy data with the assumptions attached.</h1><p>Start with a topic, then see the source, unit, update status, and what a figure can—and cannot—tell you.</p></section>{energyNow ? <GridDemandChart demand={energyNow.demand} updatedAt={energyNow.demandUpdatedAt} source={eiaSources.grid} /> : <EnergyNowFallback />}{energyNow?.residentialPrice && <MonthlyResidentialPrice {...energyNow.residentialPrice} source={eiaSources.retail} />}<section className="hub-grid">{areas.map(([title, description, href]) => <Link key={title} href={href}><p className="eyebrow">Data hub</p><h2>{title}</h2><p>{description}</p><b>Explore →</b></Link>)}</section><DataMeta source={dataStatus.source} updated={dataStatus.updated}><p>Hourly grid demand and monthly residential prices use distinct EIA datasets and update schedules. A price average is not a real-time tariff or individual utility bill.</p></DataMeta><NewsletterCTA /></main><SiteFooter /></>;
}

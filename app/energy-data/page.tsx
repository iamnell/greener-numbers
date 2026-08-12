import type { Metadata } from "next";
import Link from "next/link";
import { EnergyNowFallback, GridDemandChart, MonthlyResidentialPrice, DataMeta, NewsletterCTA } from "../../components/platform";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { eiaSources, getEnergyNowData } from "../../lib/data/eia";
import { dataStatus, energyNumbers } from "../../lib/data/energy";

export const revalidate = 3600;
export const metadata: Metadata = { title: "Energy data | Greener Numbers", description: "Explore transparent consumer energy data hubs for electricity, gasoline, natural gas, solar, EV costs and household energy spending.", alternates: { canonical: "/energy-data" } };
const areas = [["Electricity Prices", "Residential rates, bills, state comparisons and explanations.", "/electricity"], ["Gasoline Prices", "A future data module for consumer fuel costs and inflation context.", "/guides"], ["Natural Gas Prices", "A future data module for household heating and energy spending.", "/home-energy"], ["Solar Economics", "Payback concepts, system-cost context and transparent assumptions.", "/solar"], ["EV Costs", "Fuel cost, charging and cost-per-mile explainers.", "/ev"], ["State Energy Data", "All 50 state electricity price templates, ready for verified metrics.", "/electricity-prices/texas"]];

export default async function EnergyData() {
  const energyNow = await getEnergyNowData();
  return <><SiteHeader /><main id="main-content" className="platform-main"><section className="page-hero"><p className="eyebrow">Energy Data</p><h1>Consumer energy data with the assumptions attached.</h1><p>Start with a topic, then see the source, unit, update status, and what a figure can—and cannot—tell you.</p></section><section className="number-grid">{energyNumbers.map(n => <Link href={n.href} key={n.label}><span>{n.label}</span><b>{n.value}</b><small>{n.detail}</small></Link>)}</section>{energyNow ? <GridDemandChart demand={energyNow.demand} updatedAt={energyNow.demandUpdatedAt} source={eiaSources.grid} /> : <EnergyNowFallback />}{energyNow?.residentialPrice && <MonthlyResidentialPrice {...energyNow.residentialPrice} source={eiaSources.retail} />}<section className="hub-grid">{areas.map(([title, description, href]) => <Link key={title} href={href}><p className="eyebrow">Data hub</p><h2>{title}</h2><p>{description}</p><b>Explore →</b></Link>)}</section><DataMeta source={dataStatus.source} updated={dataStatus.updated}><p>Hourly grid demand and monthly residential prices use distinct EIA datasets and update schedules. A price average is not a real-time tariff or individual utility bill.</p></DataMeta><NewsletterCTA /></main><SiteFooter /></>;
}

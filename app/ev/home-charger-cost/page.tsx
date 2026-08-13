import type { Metadata } from "next";
import { EvCalculator } from "../../../components/ev-calculator";
import { EvPage } from "../../../components/ev-page";
import { getResidentialRate } from "../../../lib/data/eia/rates";
export const metadata: Metadata = { title: "Home EV Charger Installation Cost Calculator | Greener Numbers", description: "Estimate a Level 2 home EV charger installation cost, rebates, annual fuel savings, and payback period.", alternates: { canonical: "/ev/home-charger-cost" } };
export default async function Page() { const rate = await getResidentialRate(); return <EvPage title="Home EV Charger Installation Cost Calculator" description="Estimate your installed charger cost after incentives, the fuel savings it can support, and a simple payback period." rate={rate} crumbs={[{ label: "Home Charger Cost" }]}><EvCalculator kind="home" defaultRate={rate.centsPerKwh}/></EvPage>; }

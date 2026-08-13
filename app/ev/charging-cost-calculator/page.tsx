import type { Metadata } from "next";
import { EvCalculator } from "../../../components/ev-calculator";
import { EvPage } from "../../../components/ev-page";
import { getResidentialRate } from "../../../lib/data/eia/rates";
export const metadata: Metadata = { title: "EV Charging Cost Calculator | Greener Numbers", description: "Calculate EV cost per charge, per mile, per month, and per year with home and public charging prices.", alternates: { canonical: "/ev/charging-cost-calculator" }, openGraph: { title: "EV Charging Cost Calculator", description: "Estimate what it costs to charge your electric vehicle." } };
export default async function Page() { const rate = await getResidentialRate(); return <EvPage title="EV Charging Cost Calculator" description="See what charging your electric vehicle could cost at home, in public, and over a year." rate={rate} crumbs={[{ label: "Charging Cost Calculator" }]}><EvCalculator kind="charging" defaultRate={rate.centsPerKwh}/></EvPage>; }

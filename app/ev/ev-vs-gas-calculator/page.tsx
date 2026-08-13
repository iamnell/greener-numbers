import type { Metadata } from "next";
import { EvCalculator } from "../../../components/ev-calculator";
import { EvPage } from "../../../components/ev-page";
import { getResidentialRate } from "../../../lib/data/eia/rates";
export const metadata: Metadata = { title: "EV vs Gas Calculator | Greener Numbers", description: "Compare EV electricity costs with gasoline costs by mile, month, year, and five years.", alternates: { canonical: "/ev/ev-vs-gas-calculator" }, openGraph: { title: "EV vs Gas Calculator", description: "Compare the energy cost of an EV and gasoline vehicle." } };
export default async function Page() { const rate = await getResidentialRate(); return <EvPage title="EV vs. Gas Calculator" description="Compare the energy cost of going electric with the gasoline spending you would otherwise expect." rate={rate} crumbs={[{ label: "EV vs. Gas Calculator" }]}><EvCalculator kind="comparison" defaultRate={rate.centsPerKwh}/></EvPage>; }

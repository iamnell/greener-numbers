import type { Metadata } from "next";
import { EvPage } from "../../../components/ev-page";
import { OffPeakCalculator } from "../../../components/ev-phase-two";
export const metadata: Metadata={title:"Cheapest Time to Charge an EV Calculator | Greener Numbers",description:"Estimate how much time-of-use and off-peak EV charging could save each month and year.",alternates:{canonical:"/ev/cheapest-time-to-charge"}};
export default function Page(){return <EvPage title="Cheapest Time to Charge an EV" description="Compare peak and off-peak electricity rates to estimate the value of charging overnight or during your utility's lowest-cost period." crumbs={[{label:"Cheapest Time to Charge"}]}><OffPeakCalculator/></EvPage>}

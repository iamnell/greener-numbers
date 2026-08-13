import type { Metadata } from "next";
import { EvPage } from "../../../components/ev-page";
import { IncentiveFinder } from "../../../components/ev-phase-two";
import { federalIncentives } from "../../../lib/data/afdc/incentives";
export const metadata: Metadata={title:"EV Rebates & Incentives Finder | Greener Numbers",description:"Search EV and home charger incentives, then verify eligibility with the official program source.",alternates:{canonical:"/ev/incentives"}};
export default function Page(){return <EvPage title="EV Rebates & Incentives" description="Search refreshable federal, state, local, utility, and home-charger incentive records. Program eligibility and availability must be verified with the source." crumbs={[{label:"Incentives"}]}><IncentiveFinder incentives={federalIncentives}/></EvPage>}

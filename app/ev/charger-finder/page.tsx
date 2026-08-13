import type { Metadata } from "next";
import { EvPage } from "../../../components/ev-page";
import { ChargerFinder } from "../../../components/ev-phase-two";
export const metadata: Metadata={title:"EV Charger Finder | Greener Numbers",description:"Find public Level 2 and DC fast charging stations using DOE Alternative Fuels Data Center records.",alternates:{canonical:"/ev/charger-finder"}};
export default function Page(){return <EvPage title="EV Charger Finder" description="Search for public Level 2 and DC fast charging stations by ZIP code, city, or state. Station records are not presented as real-time availability." crumbs={[{label:"Charger Finder"}]}><ChargerFinder initialStations={[]} configured={Boolean(process.env.NREL_API_KEY)}/></EvPage>}

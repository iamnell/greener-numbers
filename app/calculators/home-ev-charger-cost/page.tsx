import type { Metadata } from "next";
import { HomeChargerCalculatorPage } from "../../../components/ev-pages";
import { pageMetadata } from "../../../lib/site";

export const metadata: Metadata = pageMetadata({ title: "Home EV Charger Cost Calculator | Greener Numbers", description: "Estimate home EV charger equipment, installation, incentives, net cost, annual savings, and simple payback.", path: "/calculators/home-ev-charger-cost" });
export default HomeChargerCalculatorPage;

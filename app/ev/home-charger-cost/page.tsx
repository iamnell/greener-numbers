import type { Metadata } from "next";
import { HomeChargerCalculatorPage } from "../../../components/ev-pages";
import { pageMetadata } from "../../../lib/site";
export const metadata: Metadata = pageMetadata({ title: "Home EV Charger Installation Cost Calculator | Greener Numbers", description: "Estimate home EV charger installation cost, incentives, fuel savings, and simple payback.", path: "/ev/home-charger-cost" });
export default HomeChargerCalculatorPage;

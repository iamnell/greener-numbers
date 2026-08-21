import type { Metadata } from "next";
import { ChargingCalculatorPage } from "../../../components/ev-pages";
import { pageMetadata } from "../../../lib/site";
export const metadata: Metadata = pageMetadata({ title: "EV Charging Cost Calculator | Greener Numbers", description: "Calculate home, public, and blended EV charging cost per mile, per 100 miles, month, and year.", path: "/ev/charging-cost-calculator" });
export default ChargingCalculatorPage;

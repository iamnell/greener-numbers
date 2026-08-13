import type { Metadata } from "next";
import { ChargingCalculatorPage } from "../../../components/ev-pages";

export const metadata: Metadata = { title: "EV Charging Cost Calculator | Greener Numbers", description: "Calculate EV charging cost per charge, per 100 miles, mile, month, and year using editable electricity and efficiency assumptions.", alternates: { canonical: "/calculators/ev-charging-cost" } };
export default ChargingCalculatorPage;

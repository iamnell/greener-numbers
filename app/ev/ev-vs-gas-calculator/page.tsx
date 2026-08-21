import type { Metadata } from "next";
import { CompareCalculatorPage } from "../../../components/ev-pages";
import { pageMetadata } from "../../../lib/site";
export const metadata: Metadata = pageMetadata({ title: "EV vs. Gas Calculator | Greener Numbers", description: "Compare EV charging costs and gasoline spending per mile, month, year, and five years.", path: "/ev/ev-vs-gas-calculator" });
export default CompareCalculatorPage;

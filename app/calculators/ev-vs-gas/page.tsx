import type { Metadata } from "next";
import { CompareCalculatorPage } from "../../../components/ev-pages";
import { pageMetadata } from "../../../lib/site";

export const metadata: Metadata = pageMetadata({ title: "EV vs. Gas Cost Calculator | Greener Numbers", description: "Compare annual EV charging costs with gasoline cost, monthly savings, and five-year energy savings.", path: "/calculators/ev-vs-gas" });
export default CompareCalculatorPage;

import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { Breadcrumbs, DataMeta, NewsletterCTA } from "../../components/platform";

export const metadata: Metadata = {
  title: "Energy cost calculators | Greener Numbers",
  description: "Transparent calculators for EV charging, EV versus gas, home charger installation, electricity bills, solar, and home energy.",
  alternates: { canonical: "/calculators" },
  openGraph: { title: "Energy cost calculators | Greener Numbers", description: "EV, solar, and electricity cost calculators with visible assumptions.", url: "/calculators" },
};

const calculators = [
  ["EV Charging Cost Calculator", "Home, public, and blended charging cost per mile, charge, month, and year.", "/calculators/ev-charging-cost", "EV & transportation"],
  ["EV vs. Gas Calculator", "Compare energy and fuel spending per mile, month, year, and five years.", "/calculators/ev-vs-gas", "EV & transportation"],
  ["Home EV Charger Cost Calculator", "Estimate installed cost, entered incentives, annual savings, and simple payback.", "/calculators/home-ev-charger-cost", "EV & transportation"],
  ["Electricity Bill Calculator", "Estimate a bill, yearly electricity cost, and daily cost from usage and rate.", "/tools/electricity-bill-calculator", "Electricity"],
  ["Appliance Energy Cost Calculator", "Estimate the cost to run a household appliance using watts, runtime, and rate.", "/tools/appliance-energy-cost-calculator", "Home efficiency"],
  ["Solar Savings Calculator", "Screen a solar project with editable production, rate, system-cost, and incentive assumptions.", "/tools/solar-savings-calculator", "Solar"],
] as const;

export default function CalculatorsPage() {
  const schema = { "@context": "https://schema.org", "@type": "WebApplication", name: "Greener Numbers energy cost calculators", applicationCategory: "FinanceApplication", operatingSystem: "Web", url: "https://greenernumbers.com/calculators", description: "EV vs. gas, solar payback, and electricity bill calculators with visible assumptions and stated limits." };
  return <><SiteHeader /><main id="main-content" className="platform-main"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators" }]} /><section className="page-hero"><p className="eyebrow">Energy calculators</p><h1>Does going green actually save you money?</h1><p>Use transparent, editable estimates for the costs that shape household energy decisions. Every result is informational—not a quote or a savings guarantee.</p></section><section className="tool-cards">{calculators.map(([title, description, href, category], index) => <Link href={href} className="tool-card" key={href}><span>0{index + 1} · {category}</span><h2>{title}</h2><p>{description}</p><b>Use calculator →</b></Link>)}</section><DataMeta source="Your entered assumptions; EIA and DOE methodology context" updated="Calculator formulas reviewed August 2026"><p>Calculator inputs remain in your browser. Where a tool starts with public data, the tool names the source, release period, and limitations.</p></DataMeta><NewsletterCTA /></main><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></>;
}

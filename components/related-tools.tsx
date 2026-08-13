import Link from "next/link";

const linksByTopic = {
  electricity: [["Electricity Bill Calculator", "/tools/electricity-bill-calculator"], ["Energy Data", "/energy-data"], ["Home Efficiency", "/home-efficiency"]],
  ev: [["EV Charging Cost Calculator", "/calculators/ev-charging-cost"], ["EV vs. Gas Calculator", "/calculators/ev-vs-gas"], ["EV incentives", "/incentives"]],
  solar: [["Solar Savings Calculator", "/tools/solar-savings-calculator"], ["Energy incentives", "/incentives"], ["Energy Data", "/energy-data"]],
  grid: [["Electricity Bill Calculator", "/tools/electricity-bill-calculator"], ["Energy Data", "/energy-data"], ["Home Efficiency", "/home-efficiency"]],
} as const;

export type RelatedTopic = keyof typeof linksByTopic;

export function RelatedTools({ topic, title = "Related tools & guides" }: { topic: RelatedTopic; title?: string }) {
  return <section className="related-content"><h2>{title}</h2>{linksByTopic[topic].map(([label, href]) => <Link href={href} key={href}>{label} →</Link>)}</section>;
}

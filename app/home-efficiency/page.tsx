import type { Metadata } from "next";
import { TopicHub } from "../../components/topic-hub";
import { pageMetadata } from "../../lib/site";

const hub = { label: "Home efficiency", title: "Home efficiency savings that make financial sense.", description: "Use transparent household estimates for appliances, electricity bills, and common efficiency upgrades before committing to a purchase.", tool: "Appliance Energy Cost Calculator", href: "/calculators", sections: [["Appliance costs", "Watts, runtime, and your electricity rate determine an appliance's energy cost."], ["Savings upgrades", "Evaluate LEDs, thermostats, insulation, heat pumps, and air sealing with clearly stated assumptions—not generic savings promises."], ["Next steps", "Start with low-cost changes, then compare expected annual savings against installed cost and useful life."]] } as const;
export const metadata: Metadata = pageMetadata({ title: "Home efficiency savings | Greener Numbers", description: hub.description, path: "/home-efficiency" });
export default function HomeEfficiency() { return <TopicHub hub={hub} />; }

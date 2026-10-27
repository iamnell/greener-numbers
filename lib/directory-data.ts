// Central content index for greener-numbers.com directory
// Mirrors actual app/ file-treeroutes (see /home/iamnell/projects/greener-numbers/app/)

export interface DirectoryPage {
  title: string;
  href: string;
  description: string;
  tags: string[];
}

export interface DirectoryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  pages: DirectoryPage[];
  featured?: string[]; // top-level section names to surface first
}

// All content across the site, organized by category with tags for filtering
export const categories: DirectoryCategory[] = [
  {
    id: "energy-data",
    name: "Energy Data",
    icon: "📊",
    description: "Electricity prices, state comparisons, hourly grid demand, and consumer-cost context — sourced from EIA and DOE.",
    pages: [
      {
        title: "Electricity Hub",
        href: "/electricity",
        description: "Understand what is driving your electricity cost (EIA data).",
        tags: ["electricity", "data-fetch"],
      },
      {
        title: "[State] Electricity Prices",
        href: "/electricity-prices/[state]",
        description: "Enter a state code to view residential electricity rates and bills.",
        tags: ["electricity", "state-data", "rates"],
      },
      {
        title: "Energy Data Hub",
        href: "/energy-data",
        description: "Consumer energy data with the assumptions attached.",
        tags: ["data-fetch", "eia", "monthly-data"],
      },
      {
        title: "[State] Energy Dashboard",
        href: "/states/[state]",
        description: "{state.name} energy costs, with the limits visible.",
        tags: ["state-data", "electricity"],
      },
    ],
  },
  {
    id: "ev-transportation",
    name: "EV & Transportation",
    icon: "🔌",
    description: "EV costs, charging infrastructure, home charger guides, incentives, and EV-vs-gas comparisons.",
    pages: [
      {
        title: "EV & Transportation Hub",
        href: "/ev",
        description: "Charging costs, comparisons, and ownership context for EVs.",
        tags: ["ev-charging", "cost-of-ownership", "transportation"],
      },
      {
        title: "Cheapest Time to Charge",
        href: "/ev/cheapest-time-to-charge",
        description: "Cheapest times to charge an EV (time-of-use analysis).",
        tags: ["ev-charging", "time-of-use", "rates"],
      },
      {
        title: "EV Charging Economics, Explained",
        href: "/ev/guides",
        description: "EV charging economics, explained.",
        tags: ["guide", "ev-charging"],
      },
      {
        title: "Charging Cost Calculator",
        href: "/ev/charging-cost-calculator",
        description: "Cost per mile, full charge, month, and year — split between home and public charging.",
        tags: ["calculator", "ev-charging", "home-charger"],
      },
      {
        title: "EV vs. Gas Calculator",
        href: "/ev/ev-vs-gas-calculator",
        description: "Compare energy and fuel spending between EV and gas per mile, month, year.",
        tags: ["calculator", "ev-charging", "comparison"],
      },
      {
        title: "EV Vehicle Comparison",
        href: "/ev/compare/[slug]",
        description: "Vehicle comparison data (not yet published for all models).",
        tags: ["ev-charging", "comparison"],
      },
      {
        title: "EV News Feed",
        href: "/ev/news",
        description: "EV news that affects what people pay.",
        tags: ["news", "ev-charging"],
      },
      {
        title: "Home Charger Cost",
        href: "/ev/home-charger-cost",
        description: "Home EV charger installation cost breakdown and guide.",
        tags: ["home-charger", "guide", "installation"],
      },
      {
        title: "EV Incentives & Rebates",
        href: "/ev/incentives",
        description: "EV rebates, incentives, and rewards (source-backed).",
        tags: ["incentives", "ev-charging", "rewards"],
      },
      {
        title: "EV Charger Finder",
        href: "/ev/charger-finder",
        description: "Find EV charging stations near you.",
        tags: ["ev-charging", "map", "infrastructure"],
      },
    ],
  },
  {
    id: "solar",
    name: "Solar Economics",
    icon: "☀️",
    description: "Solar payback, system pricing, production assumptions, incentives, and utility rules. No sales pitch — just the numbers.",
    pages: [
      {
        title: "Solar Economics Hub",
        href: "/solar",
        description: "Solar payback, pricing, production assumptions, and the questions to ask before treating a proposal as a financial outcome.",
        tags: ["solar", "payback", "pricing"],
      },
    ],
  },
  {
    id: "home-efficiency",
    name: "Home Efficiency",
    icon: "🏠",
    description: "HVAC optimization, appliance energy costs, home insulation, and practical savings for householders.",
    pages: [
      {
        title: "Home Efficiency Hub",
        href: "/home-efficiency",
        description: "Guide to lowering household energy costs through efficiency improvements.",
        tags: ["efficiency", "homes"],
      },
      {
        title: "Home Energy Savings Hub",
        href: "/home-energy",
        description: "Comprehensive guide to improving your home's energy efficiency — heating, cooling, insulation, appliances, and more.",
        tags: ["heat-pump", "insulation", "appliance"],
      },
    ],
  },
  {
    id: "incentives",
    name: "Incentives & Rebates",
    icon: "💰",
    description: "Source-reviewed federal, state, local, and utility incentive records — no generic summaries.",
    pages: [
      {
        title: "All Incentives & Rebates Hub",
        href: "/incentives",
        description: "Federal, state, local, and utility incentives for EVs and home energy. Each record includes eligibility, expiration, source URL, and review date.",
        tags: ["incentives", "rewards"],
      },
    ],
  },
  {
    id: "guides",
    name: "Guides & Explainrs",
    icon: "📚",
    description: "In-depth explainers on energy economics, EV charging strategies, solar payback methodology, and consumer-energy topics.",
    pages: [
      {
        title: "Guides Hub",
        href: "/guides",
        description: "Curated guides covering electricity pricing, EV costs, solar economics, and home efficiency explained with sources and assumptions.",
        tags: ["guide"],
      },
    ],
  },
  {
    id: "news",
    name: "News & Analysis",
    icon: "📰",
    description: "Daily sustainable finance and energy briefings with source-checking and economic context (data-fetch).",
    pages: [
      {
        title: "Latest News Hub",
        href: "/news",
        description: "Consumer-relevant energy news.",
        tags: ["news", "data-fetch"],
      },
      {
        title: "[slug] — Dynamic Article",
        href: "/news/[slug]",
        description: "Dynamic article route for published stories.",
        tags: ["news", "dynamic"],
      },
      // Individual news articles (18 total)
      {
        title: "U.S. battery storage reached nearly 52 GW by June",
        href: "/news/battery-storage-growth",
        description:
          "U.S. battery storage reached nearly 52 GW by June. That is grid capacity—not a household savings figure.",
        tags: ["news", "battery-storage"],
      },
      {
        title: "July CPI: electricity and piped-gas prices rose while the overall energy index fell",
        href: "/news/bls-july-2026-household-energy-costs",
        description:
          "July CPI: electricity and piped-gas prices rose while the overall energy index fell.",
        tags: ["news", "cpi", "bls"],
      },
      {
        title: "Greener Numbers Sustainable Finance & Energy Brief (Aug 21, 2026)",
        href: "/news/daily-sustainable-finance-energy-brief-august-21-2026",
        description: "Daily sustainable finance and energy briefing with source-checking.",
        tags: ["briefing", "sustainability"],
      },
      {
        title: "DOE selects seven battery-materials and manufacturing projects for $500 million",
        href: "/news/doe-battery-materials-manufacturing-grants-august-2026",
        description:
          "Department of Energy announces $500M in grants targeting battery materials and advanced manufacturing.",
        tags: ["doe", "manufacturing", "grants"],
      },
      {
        title: "DOE orders Michigan's Campbell plant to remain available through November",
        href: "/news/doe-campbell-plant-emergency-order-august-2026",
        description:
          "Breaking News: DOE emergency order lets PJM use Campbell Unit 1 through November.",
        tags: ["doe", "emergency-order"],
      },
      {
        title: "DOE keeps Eddystone units available through November",
        href: "/news/doe-eddystone-emergency-order-august-2026",
        description:
          "Breaking News: DOE issues emergency order on Eddystone power plant operations.",
        tags: ["doe", "emergency-order"],
      },
      {
        title: "$500 million Middletown steelmaking efficiency upgrade",
        href: "/news/doe-middletown-steel-efficiency-investment-august-2026",
        description:
          "DOE awards $500 million for Middletown steelmaking efficiency investment.",
        tags: ["doe", "manufacturing"],
      },
      {
        title: "DOE emergency order on PJM's Wagner Unit 4 through November",
        href: "/news/doe-pjm-wagner-unit-4-emergency-order-august-2026",
        description:
          "Breaking News: DOE order requires PJM to keep Wagner Unit 4 operational through the winter peak demand season.",
        tags: ["doe", "emergency-order"],
      },
      {
        title: "EIA $3.78 average U.S. gasoline price forecast for 2026",
        href: "/news/eia-2026-gasoline-price-forecast",
        description:
          'EIA forecasts a $3.78 average U.S. gasoline price for 2026. That is a national average — your pump may vary.',
        tags: ["eia", "gasoline", "forecast"],
      },
      {
        title: "EIA reports strong solar, hydropower, and wind growth in early 2026",
        href: "/news/eia-august-2026-electricity-renewables",
        description:
          "EIA reports strong solar, hydropower, and wind growth in early 2026. That is not an hourly reliability guarantee.",
        tags: ["eia", "renewables"],
      },
      {
        title: "Longer Permian wells helped lift oil and gas output (EIA)",
        href: "/news/eia-permian-longer-wells-production-august-2026",
        description:
          "Permian Basin longer laterals continued to improve dry-gas completion rates.",
        tags: ["eia", "production", "permian"],
      },
      {
        title: "EIA forecasts record U.S. natural-gas production in 2026",
        href: "/news/eia-record-natural-gas-production-2026",
        description:
          "Record natural gas output has real cost implications even as market participants discount supply-side data.",
        tags: ["eia", "natural-gas"],
      },
      {
        title: "U.S. gasoline average rose 3.6¢ in EIA's latest weekly survey",
        href: "/news/eia-us-gasoline-diesel-prices-august-25-2026",
        description:
          'Weekly fuel-price data from the Energy Information Administration.',
        tags: ["eia", "gasoline", "weekly"],
      },
      {
        title: "Puerto Rico non-major-event outage duration rose 19% in 2025",
        href: "/news/puerto-rico-outage-duration-2025",
        description:
          "Higher outage frequency and longer durations across Puerto Rico’s distribution grid in 2025.",
        tags: ["reliability", "caribbean"],
      },
      {
        title: "Translucent Energy announces 1.3 GW solar-module phase-in, South Carolina",
        href: "/news/translucent-energy-south-carolina-solar-module-factory-august-2026",
        description:
          "A new U.S. manufacturing site adds module-capacity; the timeline and incentives matter for real consumer impact.",
        tags: ["manufacturing", "solar"],
      },
      {
        title: "U.S. residential battery storage reached 1.3 GWh in Q1 (ACN-2025Q1 ACP/WoodMac)",
        href: "/news/us-residential-battery-storage-q1-2026-record",
        description:
          "Residential battery storage installed in the U.S. hit a record 1.3 GWh in Q1 from Acceleration Partners, Wood Mackenzie.",
        tags: ["battery-storage"],
      },
    ],
  },
  {
    id: "videos",
    name: "Videos & Explainers",
    icon: "🎥",
    description: "Video explainers and economic walkthroughs on energy topics. New content added as published (data-fetch from YouTube).",
    pages: [
      {
        title: "Videos Hub",
        href: "/videos",
        description:
          "Greener Numbers Videos — data-driven walkthroughs, consumer-cost context, and explainers pulled from the channel.",
        tags: ["video", "data-fetch"],
      },
    ],
  },
  {
    id: "tools-and-calculators",
    name: "Tools & Calculators",
    icon: "🧮",
    description: "Interactive calculators and data tools for energy cost comparison. Each tool is editable with real input fields.",
    pages: [
      {
        title: "Tools Hub",
        href: "/tools",
        description: "Calculate what energy really costs.",
        tags: ["tools"],
      },
      {
        title: "[slug] — Dynamic Tool (e.g., solar-savings, appliance-cost)",
        href: "/tools/[slug]",
        description: "Dynamic tool page with editable inputs and assumptions.",
        tags: ["tools", "calculator", "dynamic"],
      },
      {
        title: "EV Charging Cost Calculator",
        href: "/calculators/ev-charging-cost",
        description: "Cost per mile, monthly cost, and annual cost of charging an EV at home.",
        tags: ["calculator", "ev-charging", "home-charger"],
      },
      {
        title: "EV vs. Gas Calculator",
        href: "/calculators/ev-vs-gas",
        description: "Compare energy and fuel spending between your car and an EV — per mile, month, and year.",
        tags: ["calculator", "comparison"],
      },
      {
        title: "Home EV Charger Installation Cost Calculator",
        href: "/calculators/home-ev-charger-cost",
        description: "Installed cost of a home charger, net annual savings from your first charge, and payback timeline.",
        tags: ["calculator", "ev-charging", "home-charger"],
      },
    ],
  },
];

// Flat list of all indexed pages (used for directory page search/filter)
export function getAllPages(): DirectoryPage[] {
  return categories.flatMap((c) => c.pages);
}

// Group pages by section for the browse view
export const sectionsByCategory = Object.fromEntries(
  categories.map((cat) => [cat.id, cat])
) as Record<string, DirectoryCategory>;

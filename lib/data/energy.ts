export const dataStatus = {
  source: "U.S. Energy Information Administration (EIA)",
  updated: "2026-08-11",
  note: "Launch dataset. State figures are a limited, clearly labeled snapshot until an automated EIA refresh is enabled.",
};

export type StateMetric = { slug: string; name: string; rate?: number; bill?: number; change?: number };

const states: Array<[string, string]> = [
  ["alabama", "Alabama"], ["alaska", "Alaska"], ["arizona", "Arizona"], ["arkansas", "Arkansas"], ["california", "California"], ["colorado", "Colorado"], ["connecticut", "Connecticut"], ["delaware", "Delaware"], ["florida", "Florida"], ["georgia", "Georgia"], ["hawaii", "Hawaii"], ["idaho", "Idaho"], ["illinois", "Illinois"], ["indiana", "Indiana"], ["iowa", "Iowa"], ["kansas", "Kansas"], ["kentucky", "Kentucky"], ["louisiana", "Louisiana"], ["maine", "Maine"], ["maryland", "Maryland"], ["massachusetts", "Massachusetts"], ["michigan", "Michigan"], ["minnesota", "Minnesota"], ["mississippi", "Mississippi"], ["missouri", "Missouri"], ["montana", "Montana"], ["nebraska", "Nebraska"], ["nevada", "Nevada"], ["new-hampshire", "New Hampshire"], ["new-jersey", "New Jersey"], ["new-mexico", "New Mexico"], ["new-york", "New York"], ["north-carolina", "North Carolina"], ["north-dakota", "North Dakota"], ["ohio", "Ohio"], ["oklahoma", "Oklahoma"], ["oregon", "Oregon"], ["pennsylvania", "Pennsylvania"], ["rhode-island", "Rhode Island"], ["south-carolina", "South Carolina"], ["south-dakota", "South Dakota"], ["tennessee", "Tennessee"], ["texas", "Texas"], ["utah", "Utah"], ["vermont", "Vermont"], ["virginia", "Virginia"], ["washington", "Washington"], ["west-virginia", "West Virginia"], ["wisconsin", "Wisconsin"], ["wyoming", "Wyoming"],
];

const verified: Record<string, Omit<StateMetric, "slug" | "name">> = {
  california: { rate: 30.6, bill: 176, change: 3.8 },
  connecticut: { rate: 31.8, bill: 190, change: 5.1 },
  texas: { rate: 15.4, bill: 164, change: 2.1 },
};

export const stateMetrics: StateMetric[] = states.map(([slug, name]) => ({ slug, name, ...verified[slug] }));
export const nationalElectricity = { rate: 17.9, bill: 143, change: 4.3 };

export const energyNumbers = [
  { label: "U.S. residential electricity", value: `${nationalElectricity.rate}¢`, detail: "per kWh · launch snapshot", href: "/electricity" },
  { label: "Typical monthly electric bill", value: `$${nationalElectricity.bill}`, detail: "national average · launch snapshot", href: "/tools/electricity-bill-calculator" },
  { label: "Electricity price change", value: `+${nationalElectricity.change}%`, detail: "year over year · launch snapshot", href: "/energy-data" },
];

export const chartSeries = [15.2, 15.5, 15.9, 16.4, 16.9, 17.3, 17.9];

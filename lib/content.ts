export const siteUrl = "https://greenernumbers.com";

export const articles = [
  {
    slug: "electricity-bills-rising",
    category: "Electricity",
    title: "Why electricity bills are rising — and what households can control",
    dek: "A practical guide to separating the price of power from the things that make a monthly bill move.",
    read: "6 min read",
    published: "August 11, 2026",
    body: [
      "A utility bill is more than the price of electricity. It combines the amount of energy used, the price charged per kilowatt-hour, fixed customer charges, taxes, and—in many places—seasonal or time-of-use pricing.",
      "The most useful comparison is your own bill over time: track kilowatt-hours separately from dollars. If usage is flat but dollars rise, the rate or fixed charges changed. If both rise, weather, equipment, or household routines may be the bigger driver.",
      "Start with the measures that do not require a major purchase: reduce avoidable peak use, set heating and cooling schedules, and ask your utility about rate plans and assistance programs. Efficiency upgrades should be judged by their installed cost, expected savings, and useful life."
    ]
  },
  {
    slug: "ev-vs-gas-costs",
    category: "Transportation",
    title: "EV vs. gas: the cost difference gets clearer when you count every mile",
    dek: "Fuel savings are real, but the useful comparison includes charging, efficiency, insurance, and the way you drive.",
    read: "8 min read",
    published: "August 11, 2026",
    body: [
      "Fuel cost is the simplest part of an EV comparison. For a gasoline vehicle, annual fuel cost is miles driven divided by miles per gallon, multiplied by the gasoline price. For an EV, it is miles divided by miles per kilowatt-hour, multiplied by the electricity price.",
      "That is a screening calculation, not a full ownership model. Purchase price, financing, insurance, maintenance, resale value, public charging, and available incentives can all matter more than a modest fuel-price difference.",
      "Use a local electricity price and your actual mileage. The calculator on this site keeps the assumptions visible so you can adjust them rather than relying on a single national average."
    ]
  },
  {
    slug: "solar-payback",
    category: "Solar",
    title: "The new math of residential solar payback",
    dek: "A payback period is a useful starting point—if the assumptions are visible and local.",
    read: "7 min read",
    published: "August 11, 2026",
    body: [
      "Solar payback compares an installed system cost with the bill savings it is expected to produce. Local sunlight, roof orientation, retail rates, net-metering rules, financing terms, and incentives all change the result.",
      "A credible quote should show projected annual production, the assumed retail rate, degradation, incentive treatment, and whether maintenance or financing costs are included. Ask installers for the same assumptions in writing so proposals can be compared fairly.",
      "Payback is not the only decision lens. A household may value resilience, predictable long-run energy costs, or emissions reductions differently. The financial case should be clear before those benefits are added."
    ]
  }
] as const;

export const stateData = [
  { state: "Connecticut", rate: 31.8, bill: 190, change: 5.1 },
  { state: "California", rate: 30.6, bill: 176, change: 3.8 },
  { state: "Texas", rate: 15.4, bill: 164, change: 2.1 },
  { state: "United States", rate: 17.9, bill: 143, change: 4.3 },
] as const;

export const sourceLinks = [
  { name: "EIA electricity data", href: "https://www.eia.gov/electricity/data.php", note: "State and sector retail sales, revenue, prices, and customer counts." },
  { name: "EIA retail sales and average price", href: "https://www.eia.gov/electricity/sales_revenue_price/", note: "Annual state tables, including average monthly residential bills." },
  { name: "DOE Alternative Fuels Data Center", href: "https://afdc.energy.gov/calc/?ldid=10068", note: "Vehicle Cost Calculator assumptions and comparisons." },
] as const;

export const resourcePages = {
  "data": { eyebrow: "Data desk", title: "Data with the assumptions attached.", intro: "A launch snapshot of residential electricity information, designed to show the comparison—not to substitute for your utility bill.", sections: [["What these figures mean", "Electricity figures are average retail prices and average monthly bills, not a quote for an individual household. EIA calculates average retail price from reported revenue and sales; utility rates may differ by plan, usage, time, and fees."], ["Update policy", "This launch snapshot is refreshed manually. The source and release context are displayed on the methodology page, and each future data release will carry a visible revision date."]] },
  "methodology": { eyebrow: "Methodology", title: "How we make the numbers useful.", intro: "Greener Numbers uses primary public sources wherever possible and labels estimates clearly.", sections: [["Electricity", "We use EIA retail-sales and revenue data for state-level comparisons. Average retail price is a revenue-per-kilowatthour measure and should not be treated as a utility tariff."], ["Vehicle costs", "The EV calculator estimates annual fuel or electricity use from miles, efficiency, and user-entered prices. It intentionally excludes ownership costs that vary widely between drivers."], ["Corrections", "If a source changes or an error is identified, we update the page, record the revision date, and explain a material methodology change in the article or data note."]] },
  "editorial-standards": { eyebrow: "Editorial standards", title: "Clear sources. Clear assumptions. Clear corrections.", intro: "Our standard is simple: readers should be able to see where a number came from and what it does—and does not—mean.", sections: [["Independence", "Editorial conclusions are not sold to advertisers, vendors, or political campaigns. Sponsored work, if ever published, will be visibly labeled."], ["Evidence", "We prefer original government data, public filings, and peer-reviewed research. We link sources for material claims and state when a calculation is an estimate."], ["Corrections", "Report a potential error by contacting the editorial team. Material corrections receive a dated note on the affected page."]] },
  "about": { eyebrow: "About", title: "The economics behind everyday climate decisions.", intro: "Greener Numbers is an independent, plain-language publication about energy, transportation, and clean technology costs.", sections: [["What we cover", "Household energy bills, vehicle costs, home upgrades, incentives, and public data that help people make informed decisions."], ["What we are not", "We do not provide individualized financial, tax, legal, engineering, or investment advice. Use this work as a starting point and consult the appropriate professional for a decision with meaningful cost or risk."]] },
  "advertise": { eyebrow: "Advertising", title: "Reach readers who care about the numbers.", intro: "Greener Numbers is building a thoughtful audience around practical energy and technology decisions.", sections: [["Partner with us", "We will publish audience information, formats, and contact details here when advertising is available. Until then, we do not accept sponsored placements."], ["Editorial separation", "Advertising never determines our research questions, analysis, rankings, or conclusions."]] },
} as const;

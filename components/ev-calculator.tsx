"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { calculateChargingCost, calculateEvVsGas, calculateHomeCharger } from "../lib/ev/calculations.js";
import { track } from "../lib/analytics";

type Mode = "charging" | "compare" | "home";
type Values = Record<string, number>;
const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const moneyPrecise = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 3, maximumFractionDigits: 3 });
const presets: Record<Mode, Values> = {
  charging: { annualMiles: 12000, batteryKwh: 75, efficiencyKwhPer100Miles: 28, homeRateCents: 16, publicRateCents: 42, homePercent: 80, chargingLossPercent: 10 },
  compare: { annualMiles: 12000, evEfficiencyKwhPer100Miles: 28, homeRateCents: 16, publicRateCents: 42, homePercent: 80, chargingLossPercent: 10, gasMpg: 28, gasPrice: 3.5 },
  home: { chargerPrice: 600, laborCost: 500, electricalWork: 250, permitCost: 100, panelUpgrade: 0, otherCost: 0, federalIncentive: 0, stateIncentive: 0, utilityRebate: 0, manufacturerRebate: 0, otherRebate: 0, annualFuelSavings: 760 },
};
const fields: Record<Mode, Array<[string, string, string, number]>> = {
  charging: [["Annual miles driven", "annualMiles", "miles", 1], ["Battery capacity", "batteryKwh", "kWh", 1], ["EV efficiency", "efficiencyKwhPer100Miles", "kWh per 100 miles", .1], ["Home electricity rate", "homeRateCents", "¢ per kWh", .1], ["Public charging price", "publicRateCents", "¢ per kWh", .1], ["Home charging share", "homePercent", "%", 1], ["Charging-loss assumption", "chargingLossPercent", "%", 1]],
  compare: [["Annual miles driven", "annualMiles", "miles", 1], ["EV efficiency", "evEfficiencyKwhPer100Miles", "kWh per 100 miles", .1], ["Home electricity rate", "homeRateCents", "¢ per kWh", .1], ["Public charging price", "publicRateCents", "¢ per kWh", .1], ["Home charging share", "homePercent", "%", 1], ["Charging-loss assumption", "chargingLossPercent", "%", 1], ["Gas vehicle efficiency", "gasMpg", "MPG", .1], ["Gasoline price", "gasPrice", "$ per gallon", .01]],
  home: [["Charger purchase price", "chargerPrice", "$", 1], ["Installation / labor", "laborCost", "$", 1], ["Electrical work", "electricalWork", "$", 1], ["Permit cost", "permitCost", "$", 1], ["Panel upgrade", "panelUpgrade", "$", 1], ["Other installation costs", "otherCost", "$", 1], ["Federal incentive", "federalIncentive", "$", 1], ["State incentive", "stateIncentive", "$", 1], ["Utility rebate", "utilityRebate", "$", 1], ["Manufacturer rebate", "manufacturerRebate", "$", 1], ["Other rebate", "otherRebate", "$", 1], ["Estimated annual fuel savings", "annualFuelSavings", "$", 1]],
};

export function EvCalculator({ mode, rateDefault }: { mode: Mode; rateDefault?: number }) {
  const searchParams = useSearchParams();
  const initialValues = useMemo(() => {
    const next = { ...presets[mode] };
    if ((mode === "charging" || mode === "compare") && rateDefault && rateDefault > 0) next.homeRateCents = rateDefault;
    for (const key of Object.keys(next)) { const value = Number(searchParams.get(key)); if (searchParams.has(key) && Number.isFinite(value) && value >= 0) next[key] = value; }
    return next;
  }, [mode, rateDefault, searchParams]);
  const [values, setValues] = useState<Values>(initialValues);
  useEffect(() => { track("ev_calculator_started", { calculator: mode }); }, [mode]);
  const set = (key: string, value: number) => setValues((current) => ({ ...current, [key]: Math.max(0, Number.isFinite(value) ? value : 0) }));
  // The calculator mode determines the result shape; each render branch consumes only its mode's fields.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = useMemo(() => mode === "charging" ? calculateChargingCost(values) : mode === "compare" ? calculateEvVsGas(values) : calculateHomeCharger(values), [mode, values]);
  const shareUrl = () => { const query = new URLSearchParams(Object.entries(values).map(([key, value]) => [key, String(value)])); window.history.replaceState(null, "", `${window.location.pathname}?${query}`); navigator.clipboard?.writeText(window.location.href); track(mode === "compare" ? "ev_vs_gas_completed" : mode === "home" ? "home_charger_calculation_completed" : "ev_calculator_completed", { calculator: mode }); };
  const cards = mode === "charging" ? [["Cost per full charge", money(result.costPerFullCharge)], ["Cost per 100 miles", money(result.costPer100Miles)], ["Cost per mile", moneyPrecise(result.costPerMile)], ["Monthly charging cost", money(result.monthlyCost)], ["Annual charging cost", money(result.combinedAnnualCost)], ["Estimated electricity use", `${result.annualEnergyKwh.toLocaleString()} kWh/year`], ["Home charging cost", money(result.homeAnnualCost)], ["Public charging cost", money(result.publicAnnualCost)]] : mode === "compare" ? [["EV energy cost", money(result.evMonthlyCost) + "/month"], ["Gasoline cost", money(result.gasMonthlyCost) + "/month"], ["Estimated savings", money(result.monthlySavings) + "/month"], ["Annual savings", money(result.annualSavings) + "/year"], ["Five-year energy/fuel savings", money(result.fiveYearSavings)], ["EV cost per mile", moneyPrecise(result.costPerMile)], ["Gas cost per mile", moneyPrecise(result.gasCostPerMile)]] : [["Gross installation cost", money(result.grossInstallationCost)], ["Rebates and incentives", money(result.totalIncentives)], ["Estimated net installation cost", money(result.netInstallationCost)], ["Estimated annual fuel savings", money(result.annualFuelSavings)], ["Estimated payback period", result.paybackYears === null ? "Not available" : `${result.paybackYears.toFixed(1)} years`]];
  return <section className="ev-calculator"><div className="calculator-fields">{fields[mode].map(([label, key, hint, step]) => <label className="calc-field" key={key}>{label}<small>{hint}</small><input type="number" min="0" step={step} value={values[key]} onChange={(event) => set(key, Number(event.target.value))} /></label>)}</div><button className="button text share-calculator" type="button" onClick={shareUrl}>Copy shareable inputs →</button><output className="ev-results"><p className="eyebrow">Your estimate</p><div>{cards.map(([label, value], index) => <article key={label} className={index === 2 ? "emphasis" : ""}><span>{label}</span><strong>{value}</strong></article>)}</div></output></section>;
}

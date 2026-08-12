"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

function Field({ label, value, update, step = 1 }: { label: string; value: number; update: (value: number) => void; step?: number }) {
  return <label>{label}<input type="number" min="0" step={step} value={value} onChange={(e) => update(Math.max(0, Number(e.target.value)))} /></label>;
}

export default function CalculatorsPage() {
  const [miles, setMiles] = useState(12000); const [mpg, setMpg] = useState(28); const [gas, setGas] = useState(3.45); const [efficiency, setEfficiency] = useState(3.3); const [electricity, setElectricity] = useState(0.18);
  const result = useMemo(() => { const gasCost = miles / mpg * gas; const evCost = miles / efficiency * electricity; return { gasCost, evCost, savings: gasCost - evCost }; }, [miles, mpg, gas, efficiency, electricity]);
  return <main className="article-page"><header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/methodology">Methodology</Link></header><section className="calculator-page"><p className="eyebrow">Open calculator</p><h1>EV vs. gas fuel cost</h1><p className="article-dek">Compare annual energy costs with your own mileage, efficiency, and local prices. This is a fuel-cost estimate only; it excludes purchase price, financing, insurance, maintenance, and incentives.</p><div className="calculator full"><div className="inputs calculator-inputs"><Field label="Annual miles" value={miles} update={setMiles}/><Field label="Gas mpg" value={mpg} update={setMpg}/><Field label="Gas price ($/gal)" value={gas} update={setGas} step={0.01}/><Field label="EV mi/kWh" value={efficiency} update={setEfficiency} step={0.1}/><Field label="Electricity ($/kWh)" value={electricity} update={setElectricity} step={0.01}/></div><div className="calc-results"><div><span>Gas car</span><b>${result.gasCost.toLocaleString(undefined,{maximumFractionDigits:0})}</b></div><div><span>EV</span><b>${result.evCost.toLocaleString(undefined,{maximumFractionDigits:0})}</b></div><div className="savings"><span>Difference</span><b>${Math.abs(result.savings).toLocaleString(undefined,{maximumFractionDigits:0})}<small>/year</small></b></div></div></div><p className="method">For a broader ownership-cost comparison, see the U.S. Department of Energy’s Alternative Fuels Data Center calculator.</p></section></main>;
}

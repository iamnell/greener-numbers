"use client";

import { useMemo, useState } from "react";

const nav = ["Energy costs", "Electricity", "Solar", "Electric vehicles", "Home energy", "Data & research"];

const stories = [
  { tag: "Electricity", title: "Why electricity bills are rising — and what households can control", read: "6 min read", metric: "+4.3%", detail: "average retail price change, year over year" },
  { tag: "Transportation", title: "EV vs. gas: the cost difference gets clearer when you count every mile", read: "8 min read", metric: "$1,140", detail: "estimated annual fuel savings" },
  { tag: "Solar", title: "The new math of residential solar payback", read: "7 min read", metric: "8.2 yrs", detail: "median payback period" },
];

const tools = [
  ["EV vs. Gas", "Compare ownership and fuel costs", "→"],
  ["Solar payback", "See when panels break even", "→"],
  ["Electricity bill", "Understand your utility charges", "→"],
  ["Heat pump vs. furnace", "Compare long-term heating costs", "→"],
];

const dataRows = [
  ["Connecticut", "31.8¢", "$190", "↑ 5.1%"],
  ["California", "30.6¢", "$176", "↑ 3.8%"],
  ["Texas", "15.4¢", "$164", "↑ 2.1%"],
  ["United States", "17.9¢", "$143", "↑ 4.3%"],
];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [miles, setMiles] = useState(12000);
  const [mpg, setMpg] = useState(28);
  const [gas, setGas] = useState(3.45);
  const [efficiency, setEfficiency] = useState(3.3);
  const [electricity, setElectricity] = useState(0.18);
  const result = useMemo(() => {
    const gasCost = (miles / mpg) * gas;
    const evCost = (miles / efficiency) * electricity;
    return { gasCost, evCost, savings: gasCost - evCost };
  }, [miles, mpg, gas, efficiency, electricity]);

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Greener Numbers home"><span>GREENER</span> NUMBERS</a>
        <nav aria-label="Main navigation">{nav.map((item) => <a href={`#${item.toLowerCase().replaceAll(" ", "-").replace("&", "and")}`} key={item}>{item}</a>)}</nav>
        <a className="header-link" href="#newsletter">Get the brief <Arrow /></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Independent data journalism</p>
          <h1>The economics<br />of going green.</h1>
          <p className="lede">Clear analysis, useful tools, and honest answers about what energy, transportation, and clean technology actually cost.</p>
          <div className="actions"><a className="button primary" href="#data">Explore the data <Arrow /></a><a className="button text" href="#calculator">Use our calculators</a></div>
          <div className="source-note"><span className="dot" /> Built on public data from EIA, DOE, BLS & more</div>
        </div>
        <div className="hero-visual" aria-label="Household energy cost line chart">
          <div className="chart-label"><b>Household energy costs</b><span>Monthly average · indexed</span></div>
          <div className="chart-value">$328 <small>+18% since 2021</small></div>
          <svg viewBox="0 0 600 290" role="img" aria-label="A chart showing household energy costs rising from 2021 through 2026">
            <g className="grid"><line x1="0" x2="600" y1="45" y2="45"/><line x1="0" x2="600" y1="120" y2="120"/><line x1="0" x2="600" y1="195" y2="195"/><line x1="0" x2="600" y1="270" y2="270"/></g>
            <path className="area" d="M0 248 C50 238 75 229 110 237 S180 222 225 213 S295 229 340 172 S415 179 452 154 S520 119 600 74 L600 290 L0 290Z"/>
            <path className="line" d="M0 248 C50 238 75 229 110 237 S180 222 225 213 S295 229 340 172 S415 179 452 154 S520 119 600 74"/>
            <circle cx="600" cy="74" r="6"/><text x="0" y="287">2021</text><text x="184" y="287">2023</text><text x="370" y="287">2025</text><text x="552" y="287">2026</text>
          </svg>
          <div className="chart-callout">Electricity, natural gas & gasoline<br /><b>Consumer cost index</b></div>
        </div>
      </section>

      <section className="ticker"><span>THE NUMBERS TODAY</span><p>U.S. electricity prices <b>+4.3%</b> year over year</p><i /><p>Gasoline average <b>$3.45/gal</b></p><i /><p>Utility-scale solar cost <b>−9%</b> in 12 months</p><a href="#data">View data <Arrow /></a></section>

      <section className="section latest" id="energy-costs"><div className="section-head"><p className="eyebrow">Latest analysis</p><a href="#">All analysis <Arrow /></a></div><div className="story-grid">{stories.map((story, i) => <article className="story" key={story.title}><div className={`story-art art-${i}`}><span>{story.metric}</span><small>{story.detail}</small>{i === 1 && <div className="mini-bars"><i/><i/><i/><i/><i/></div>}</div><p className="tag">{story.tag}</p><h2>{story.title}</h2><div className="article-meta">{story.read}<span>·</span><a href="#">Read analysis <Arrow /></a></div></article>)}</div></section>

      <section className="calculator-section" id="calculator"><div className="calculator-copy"><p className="eyebrow">Try a calculator</p><h2>What would an EV actually save you?</h2><p>Run the numbers with your driving habits, local gas price, and electricity rate. No lead form required.</p><a href="#calculator" className="underlined">See full EV vs. gas calculator <Arrow /></a></div><div className="calculator"><div className="calc-top"><span>EV vs. gas cost calculator</span><small>Annual estimate</small></div><div className="inputs"><label>Annual miles<input type="number" value={miles} onChange={(e) => setMiles(Number(e.target.value))} /></label><label>Gas mpg<input type="number" value={mpg} onChange={(e) => setMpg(Number(e.target.value))} /></label><label>Gas price<input type="number" step=".01" value={gas} onChange={(e) => setGas(Number(e.target.value))} /></label><label>EV mi/kWh<input type="number" step=".1" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))} /></label><label>Electricity / kWh<input type="number" step=".01" value={electricity} onChange={(e) => setElectricity(Number(e.target.value))} /></label></div><div className="calc-results"><div><span>Gas car</span><b>${result.gasCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</b></div><div><span>EV</span><b>${result.evCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</b></div><div className="savings"><span>You could save</span><b>${Math.max(0, result.savings).toLocaleString(undefined, { maximumFractionDigits: 0 })}<small>/year</small></b></div></div></div></section>

      <section className="section tool-section" id="electricity"><div className="section-head"><div><p className="eyebrow">Built for decisions</p><h2>Tools that make the math useful.</h2></div><a href="#calculator">Browse calculators <Arrow /></a></div><div className="tool-grid">{tools.map(([title, desc, arrow], i) => <a className="tool" href="#calculator" key={title}><span className={`tool-num n${i}`}>0{i + 1}</span><h3>{title}</h3><p>{desc}</p><b>{arrow}</b></a>)}</div></section>

      <section className="data-section" id="data"><div className="data-copy"><p className="eyebrow">Data, not guesses</p><h2>Electricity prices<br />by state</h2><p>Compare residential rates, typical bills, and year-over-year changes. Updated monthly as new public data becomes available.</p><a className="button primary" href="#data">Explore all state data <Arrow /></a><p className="method">Source: U.S. Energy Information Administration · Updated August 2026</p></div><div className="data-table"><div className="table-caption"><span>Residential electricity snapshot</span><button>United States⌄</button></div><div className="table-row header"><span>State</span><span>Rate / kWh</span><span>Typical bill</span><span>1-year change</span></div>{dataRows.map((row, i) => <div className="table-row" key={row[0]}>{row.map((item, j) => <span className={j === 3 ? "change" : ""} key={item}>{item}{i === 3 && j === 0 && <em>National average</em>}</span>)}</div>)}<a className="table-link" href="#data">View all 50 states <Arrow /></a></div></section>

      <section className="section more" id="solar"><div><p className="eyebrow">More to explore</p><h2>Make better energy decisions.</h2></div><div className="more-links"><a href="#">Solar & home energy <span>Cost, payback, incentives <Arrow /></span></a><a href="#">Electric vehicles <span>Charging, ownership, tax credits <Arrow /></span></a><a href="#">Policy & incentives <span>What changed and who benefits <Arrow /></span></a></div></section>

      <section className="newsletter" id="newsletter"><p className="eyebrow">The weekly brief</p><h2>The numbers worth knowing.</h2><p>A sharp, free read on the money behind energy and the green transition. No hype. Just context.</p><form onSubmit={(e) => e.preventDefault()}><input type="email" aria-label="Email address" placeholder="Your email address" /><button type="submit">Subscribe <Arrow /></button></form><small>By subscribing, you agree to receive emails from Greener Numbers. Unsubscribe anytime.</small></section>

      <footer><a className="wordmark" href="#top"><span>GREENER</span> NUMBERS</a><p>Making the economics of going green easier to understand.</p><div><a href="#">About</a><a href="#">Methodology</a><a href="#">Editorial standards</a><a href="#">Advertise</a></div><small>© 2026 Greener Numbers. Information is for education, not financial advice.</small></footer>
    </main>
  );
}

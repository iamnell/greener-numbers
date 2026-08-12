"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NewsletterForm } from "../components/newsletter-form";
import { articles, stateData } from "../lib/content";

const stories = articles.map((article, index) => ({ ...article, metric: ["+4.3%", "$1,140", "8.2 yrs"][index], detail: ["average retail price change, year over year", "estimated annual fuel savings", "illustrative payback period"][index] }));

const tools = [
  ["EV vs. Gas", "Compare annual energy costs", "/calculators#ev"],
  ["Solar payback", "See when panels break even", "/calculators#solar"],
  ["Electricity bill", "See usage and rate effects", "/calculators#bill"],
];


function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
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
        <nav aria-label="Main navigation"><Link href="/electricity-bills-rising">Energy costs</Link><Link href="/data">Electricity</Link><Link href="/solar-payback">Solar</Link><Link href="/ev-vs-gas-costs">Electric vehicles</Link><Link href="/methodology">Home energy</Link><Link href="/data">Data & research</Link></nav>
        <a className="header-link" href="#newsletter">Get the brief <Arrow /></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "Close" : "Menu"}<span aria-hidden="true">{menuOpen ? "×" : "☰"}</span></button>
        {menuOpen && <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation"><a onClick={() => setMenuOpen(false)} href="#top">Home</a><Link onClick={() => setMenuOpen(false)} href="/electricity-bills-rising">Energy costs</Link><Link onClick={() => setMenuOpen(false)} href="/data">Electricity data</Link><Link onClick={() => setMenuOpen(false)} href="/solar-payback">Solar</Link><Link onClick={() => setMenuOpen(false)} href="/ev-vs-gas-costs">Electric vehicles</Link><Link onClick={() => setMenuOpen(false)} href="/calculators">Calculators</Link><a onClick={() => setMenuOpen(false)} href="#newsletter">The weekly brief</a></nav>}
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Independent data journalism</p>
          <h1>The economics<br />of going green.</h1>
          <p className="lede">Clear analysis, useful tools, and honest answers about what energy, transportation, and clean technology actually cost.</p>
          <div className="actions"><Link className="button primary" href="/data">Explore the data <Arrow /></Link><Link className="button text" href="/calculators">Use our calculators</Link></div>
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

      <section className="field-note"><div className="field-note-copy"><p className="eyebrow">The household view</p><h2>Better decisions start at the kitchen table.</h2><p>Energy choices are rarely abstract. They show up in monthly bills, the car in the driveway, and the upgrades a household can actually afford.</p><Link href="/about" className="underlined">What Greener Numbers covers <Arrow /></Link></div><Image className="field-note-image" src="/greener-numbers-home-energy-editorial.png" width={1672} height={1114} sizes="(max-width: 850px) 100vw, 54vw" alt="A home with rooftop solar panels and an electric vehicle seen from a sunlit kitchen table." /></section>

      <section className="section latest" id="energy-costs"><div className="section-head"><div><p className="eyebrow">Launch analysis</p><h2>Start with the decision, then inspect the numbers.</h2></div><Link href="/methodology">How we report <Arrow /></Link></div><div className="story-grid">{stories.map((story, i) => <article className="story" key={story.title}><div className={`story-art art-${i}`}><span>{story.metric}</span><small>{story.detail}</small>{i === 1 && <div className="mini-bars"><i/><i/><i/><i/><i/></div>}</div><p className="tag">{story.category}</p><h2>{story.title}</h2><div className="article-meta"><span>Published Aug. 11, 2026</span><span>·</span>{story.read}<span>·</span><Link href={`/${story.slug}`}>Read analysis <Arrow /></Link></div></article>)}</div></section>

      <section className="calculator-section" id="calculator"><div className="calculator-copy"><p className="eyebrow">Try a calculator</p><h2>What would an EV actually save you?</h2><p>Run the numbers with your driving habits, local gas price, and electricity rate. No lead form required.</p><Link href="/calculators" className="underlined">See full EV vs. gas calculator <Arrow /></Link></div><div className="calculator"><div className="calc-top"><span>EV vs. gas cost calculator</span><small>Annual estimate</small></div><div className="inputs"><label>Annual miles<input type="number" min="0" value={miles} onChange={(e) => setMiles(Math.max(0, Number(e.target.value)))} /></label><label>Gas mpg<input type="number" min="0.1" value={mpg} onChange={(e) => setMpg(Math.max(.1, Number(e.target.value)))} /></label><label>Gas price<input type="number" min="0" step=".01" value={gas} onChange={(e) => setGas(Math.max(0, Number(e.target.value)))} /></label><label>EV mi/kWh<input type="number" min="0.1" step=".1" value={efficiency} onChange={(e) => setEfficiency(Math.max(.1, Number(e.target.value)))} /></label><label>Electricity / kWh<input type="number" min="0" step=".01" value={electricity} onChange={(e) => setElectricity(Math.max(0, Number(e.target.value)))} /></label></div><div className="calc-results"><div><span>Gas car</span><b>${result.gasCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</b></div><div><span>EV</span><b>${result.evCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</b></div><div className="savings"><span>{result.savings >= 0 ? "You could save" : "EV cost difference"}</span><b>${Math.abs(result.savings).toLocaleString(undefined, { maximumFractionDigits: 0 })}<small>/year</small></b></div></div></div></section>

      <section className="section tool-section" id="electricity"><div className="section-head"><div><p className="eyebrow">Built for decisions</p><h2>Tools that make the math useful.</h2></div><Link href="/calculators">Browse calculators <Arrow /></Link></div><div className="tool-grid">{tools.map(([title, desc, href], i) => <Link className="tool" href={href} key={title}><span className={`tool-num n${i}`}>0{i + 1}</span><h3>{title}</h3><p>{desc}</p><b>→</b></Link>)}</div></section>

      <section className="data-section" id="data"><div className="data-copy"><p className="eyebrow">Data, not guesses</p><h2>Electricity prices<br />by state</h2><p>Compare residential rates, typical bills, and year-over-year changes. This launch snapshot is clearly dated while a recurring update workflow is put in place.</p><Link className="button primary" href="/data">Explore all state data <Arrow /></Link><p className="method">Launch snapshot · August 11, 2026<br />Source: U.S. Energy Information Administration · See methodology for definitions and release context.</p></div><div className="data-table"><div className="table-caption"><span>Residential electricity snapshot</span><Link href="/methodology">Methodology ↗</Link></div><div className="table-row header"><span>State</span><span>Rate / kWh</span><span>Typical bill</span><span>1-year change</span></div>{stateData.map((row, i) => <div className="table-row" key={row.state}><span>{row.state}{i === 3 && <em>National average</em>}</span><span>{row.rate}¢</span><span>${row.bill}</span><span className="change">↑ {row.change}%</span></div>)}<Link className="table-link" href="/data">Definitions & sources <Arrow /></Link></div></section>

      <section className="section more" id="solar"><div><p className="eyebrow">More to explore</p><h2>Make better energy decisions.</h2></div><div className="more-links"><Link href="/solar-payback">Solar & home energy <span>Cost, payback, incentives <Arrow /></span></Link><Link href="/ev-vs-gas-costs">Electric vehicles <span>Charging, ownership, tax credits <Arrow /></span></Link><Link href="/editorial-standards">Policy & incentives <span>Clear analysis, clear standards <Arrow /></span></Link></div></section>

      <section className="newsletter" id="newsletter"><p className="eyebrow">The weekly brief</p><h2>The numbers worth knowing.</h2><p>A sharp, free read on the money behind energy and the green transition. No hype. Just context.</p><NewsletterForm /><small>By subscribing, you agree to receive emails from Greener Numbers. Unsubscribe anytime.</small></section>

      <footer><a className="wordmark" href="#top"><span>GREENER</span> NUMBERS</a><p>Making the economics of going green easier to understand.</p><div><Link href="/about">About</Link><Link href="/methodology">Methodology</Link><Link href="/editorial-standards">Editorial standards</Link><Link href="/advertise">Advertise</Link></div><small>© 2026 Greener Numbers. Information is for education, not financial advice.</small></footer>
    </main>
  );
}

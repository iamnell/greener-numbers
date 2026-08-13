import Link from "next/link";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <span key={item.label}>{index > 0 && <b aria-hidden="true">/</b>}{item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}</span>)}</nav>;
}

export function DataMeta({ source, updated, children }: { source?: string; updated?: string; children?: React.ReactNode }) {
  return <aside className="data-meta"><b>Data source</b><span>{source ?? "U.S. Energy Information Administration"}</span><b>Last updated</b><span>{updated ?? "Launch snapshot · August 11, 2026"}</span>{children}</aside>;
}

export function MethodologyBox({ title = "How we calculate this", children }: { title?: string; children: React.ReactNode }) {
  return <aside className="methodology-box"><p className="eyebrow">Methodology</p><h2>{title}</h2><div>{children}</div><Link href="/methodology">Read the full methodology →</Link></aside>;
}

export function NewsletterCTA() { return <section className="newsletter-cta"><p className="eyebrow">Greener Numbers Weekly</p><h2>Energy prices. Consumer costs. The economics of going green.</h2><p>One useful email each week: the numbers, context, and a tool worth using.</p><Link className="button primary" href="/#newsletter">Subscribe to newsletter →</Link></section>; }

export function SourceList({ sources }: { sources: Array<{ name: string; href: string }> }) { return <section className="source-listing"><h2>Sources</h2><ul>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.name} ↗</a></li>)}</ul></section>; }

type GridDemandPoint = { period: string; megawattHours: number };

function compactNumber(value: number) { return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value); }
function displayHour(period: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", hour12: true, timeZone: "UTC" }).format(new Date(`${period}:00:00Z`)); }

export function GridDemandChart({ demand, updatedAt, source }: { demand: GridDemandPoint[]; updatedAt: string; source: string }) {
  const values = demand.map((point) => point.megawattHours);
  const max = Math.max(...values); const min = Math.min(...values);
  const points = demand.map((point, index) => `${(index / Math.max(demand.length - 1, 1)) * 100},${92 - ((point.megawattHours - min) / Math.max(max - min, 1)) * 70}`).join(" ");
  const latest = demand[demand.length - 1];
  return <figure className="chart-card"><figcaption><span>Lower 48 electricity demand</span><small>Official EIA hourly data</small></figcaption><strong className="chart-value">{compactNumber(latest.megawattHours)}<small>MWh</small></strong><svg viewBox="0 0 100 100" role="img" aria-label={`U.S. Lower 48 electricity demand. Latest available hour: ${compactNumber(latest.megawattHours)} megawatt-hours.`} preserveAspectRatio="none"><line x1="0" x2="100" y1="92" y2="92"/><line x1="0" x2="100" y1="57" y2="57"/><line x1="0" x2="100" y1="22" y2="22"/><polyline points={points}/></svg><p>Latest available hour: {displayHour(updatedAt)} UTC · refreshed at most hourly · <a href={source} target="_blank" rel="noreferrer">EIA Grid Monitor ↗</a></p></figure>;
}

export function EnergyNowFallback() {
  return <figure className="chart-card"><figcaption><span>Lower 48 electricity demand</span><small>Official EIA hourly data</small></figcaption><p className="chart-unavailable">The hourly EIA feed is temporarily unavailable. We do not substitute an illustrative trend.</p><p><a href="https://www.eia.gov/electricity/gridmonitor/" target="_blank" rel="noreferrer">View the official EIA Grid Monitor ↗</a></p></figure>;
}

export function MonthlyResidentialPrice({ centsPerKwh, period, source }: { centsPerKwh: number; period: string; source: string }) {
  return <aside className="data-meta live-data-card"><b>Latest U.S. residential electricity price</b><span>{centsPerKwh.toFixed(2)}¢ per kWh</span><b>Official data through</b><span>{period}</span><p>This is a monthly national average retail-price measure, not a real-time tariff or an individual household bill. <a href={source} target="_blank" rel="noreferrer">EIA source ↗</a></p></aside>;
}

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

export function NewsletterCTA() { return <section className="newsletter-cta"><p className="eyebrow">Greener Numbers Weekly</p><h2>Energy prices. Consumer costs. The economics of going green.</h2><p>One useful email each week: the numbers, context, and a tool worth using.</p><Link className="button primary" href="/#newsletter">Get the weekly brief →</Link></section>; }

export function SourceList({ sources }: { sources: Array<{ name: string; href: string }> }) { return <section className="source-listing"><h2>Sources</h2><ul>{sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.name} ↗</a></li>)}</ul></section>; }

export function ChartCard({ title, values, note }: { title: string; values: number[]; note: string }) {
  const max = Math.max(...values); const min = Math.min(...values); const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${92 - ((value - min) / Math.max(max - min, 1)) * 70}`).join(" ");
  return <figure className="chart-card"><figcaption><span>{title}</span><small>{note}</small></figcaption><svg viewBox="0 0 100 100" role="img" aria-label={`${title}. ${note}`} preserveAspectRatio="none"><line x1="0" x2="100" y1="92" y2="92"/><line x1="0" x2="100" y1="57" y2="57"/><line x1="0" x2="100" y1="22" y2="22"/><polyline points={points}/></svg><p>Trend visualization based on the stated launch snapshot; it is not a real-time feed.</p></figure>;
}

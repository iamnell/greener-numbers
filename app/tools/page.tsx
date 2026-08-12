import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { Breadcrumbs, DataMeta, NewsletterCTA } from "../../components/platform";
import { tools } from "../../lib/tools";

export const metadata: Metadata = { title: "Energy cost calculators | Greener Numbers", description: "Practical, transparent calculators for electricity bills, appliances, EVs, solar, home energy, and energy inflation.", alternates: { canonical: "/tools" } };
export default function ToolsPage() { return <><SiteHeader/><main id="main-content" className="platform-main"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"Tools"}]}/><section className="page-hero"><p className="eyebrow">Energy calculators</p><h1>Calculate what energy really costs.</h1><p>Start with assumptions you can see and change. These tools are educational estimates—not quotes, guarantees, or individualized advice.</p></section><section className="tool-cards">{tools.map((tool, index) => <Link href={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}><span>0{index + 1} · {tool.category}</span><h2>{tool.title}</h2><p>{tool.description}</p><small>{tool.inputs}</small><b>Use calculator →</b></Link>)}</section><DataMeta><p>Each calculator is client-side, keeps formulas visible, and does not save personal inputs.</p></DataMeta><NewsletterCTA/></main><SiteFooter/></>; }

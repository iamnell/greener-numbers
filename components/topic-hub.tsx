import Link from "next/link";
import { DataMeta, NewsletterCTA } from "./platform";
import { SiteFooter, SiteHeader } from "./site-header";
export type Hub = { label:string; title:string; description:string; tool:string; href:string; sections:readonly (readonly [string,string])[] };
export function TopicHub({hub}:{hub:Hub}){return <><SiteHeader/><main id="main-content" className="platform-main"><section className="page-hero"><p className="eyebrow">{hub.label}</p><h1>{hub.title}</h1><p>{hub.description}</p><Link className="button primary" href={hub.href}>{hub.tool} →</Link></section><section className="content-sections">{hub.sections.map(([title,copy])=><section key={title}><h2>{title}</h2><p>{copy}</p></section>)}</section><DataMeta><p>Pages in this hub use source and methodology context. No live energy data feed is connected yet.</p></DataMeta><NewsletterCTA/></main><SiteFooter/></>;}

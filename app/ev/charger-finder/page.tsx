import type { Metadata } from "next";
import Link from "next/link";
import { ChargerFinderClient } from "../../../components/charger-finder-client";
import { SiteFooter, SiteHeader } from "../../../components/site-header";
import { Breadcrumbs, MethodologyBox, NewsletterCTA } from "../../../components/platform";
import { pageMetadata } from "../../../lib/site";

export const metadata: Metadata = pageMetadata({ title: "EV Charger Finder | Greener Numbers", description: "Find public EV charging stations by location, connector, charging level, and access when authoritative DOE/NREL data is connected.", path: "/ev/charger-finder" });
export default function ChargerFinder() { return <><SiteHeader /><main className="platform-main" id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"EV & Transportation",href:"/ev"},{label:"EV Charger Finder"}]} /><section className="tool-hero"><p className="eyebrow">EV charging</p><h1>EV Charger Finder</h1><p>Search public charging stations by ZIP code, city, connector, and charging level.</p></section><ChargerFinderClient /><MethodologyBox><p><strong>Data boundary:</strong> the station directory will be server-fetched, rate-limited, cached, time-stamped, and source-linked. Location permission will be optional and not stored by default.</p></MethodologyBox><section className="related-content"><h2>Related EV tools</h2><Link href="/ev/charging-cost-calculator">EV Charging Cost Calculator →</Link><Link href="/ev/incentives">EV rebates & incentives →</Link></section><NewsletterCTA /></main><SiteFooter /></> }

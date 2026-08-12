import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../../components/site-header";
import { Breadcrumbs, NewsletterCTA } from "../../../components/platform";
const guides=[
["How much does it cost to charge an EV?","Use home and public charging prices, efficiency, charging loss, and mileage—not a single generic number.","/ev/charging-cost-calculator"],
["Is home EV charging cheaper than gas?","Compare energy use per mile and keep purchase, insurance, financing, and maintenance separate.","/ev/ev-vs-gas-calculator"],
["How much does a Level 2 charger cost to install?","Separate equipment, labor, permits, electrical work, panel upgrades, and verified incentives.","/ev/home-charger-cost"],
["How time-of-use EV charging works","Rate windows can reward overnight charging, but the tariff terms are utility-specific.","/ev/cheapest-time-to-charge"],
] as const;
export const metadata:Metadata={title:"EV Charging Guides | Greener Numbers",description:"Source-aware explainers on EV charging, home chargers, time-of-use rates, and operating costs.",alternates:{canonical:"/ev/guides"}};
export default function EvGuides(){return <><SiteHeader/><main className="platform-main" id="main-content"><Breadcrumbs items={[{label:"Home",href:"/"},{label:"EV & Transportation",href:"/ev"},{label:"EV Charging Guides"}]}/><section className="page-hero"><p className="eyebrow">EV guides</p><h1>EV charging economics, explained.</h1><p>Practical explainers built around the data and assumptions that move household costs—not car reviews, product rumors, or generic automotive coverage.</p></section><section className="platform-section"><div className="article-cards">{guides.map(([title,dek,href])=><Link href={href} key={title}><span>EV economics guide</span><h3>{title}</h3><p>{dek}</p><small>Use the related calculator →</small></Link>)}</div></section><NewsletterCTA/></main><SiteFooter/></>}

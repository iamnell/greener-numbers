"use client";
import Link from "next/link";
import { useState } from "react";

const mainLinks = [["Calculators", "/calculators"], ["Electricity", "/electricity"], ["Solar", "/solar"], ["EV & Transportation", "/ev"], ["Home Efficiency", "/home-efficiency"], ["Energy Data", "/energy-data"], ["Guides", "/guides"], ["News", "/news"]] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="platform-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><nav aria-label="Primary navigation">{mainLinks.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav><Link className="header-link" href="/#newsletter">Subscribe to newsletter ↗</Link><button className="menu-toggle" type="button" aria-expanded={open} aria-controls="platform-menu" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span aria-hidden="true">{open ? "×" : "☰"}</span></button>{open && <nav className="mobile-menu" id="platform-menu" aria-label="Mobile navigation">{mainLinks.map(([label, href]) => <Link onClick={close} href={href} key={href}>{label}</Link>)}<Link onClick={close} href="/#newsletter">Subscribe to newsletter</Link></nav>}</header>;
}

export function SiteFooter() { return <footer className="platform-footer"><div><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><p>The economics of going green.</p></div><nav aria-label="Footer navigation"><Link href="/calculators">Calculators</Link><Link href="/incentives">Incentives</Link><Link href="/energy-data">Energy Data</Link><Link href="/ev">EV & Transportation</Link><Link href="/contact">Contact</Link><Link href="/editorial-policy">Editorial Policy</Link><Link href="/sources">Sources</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/affiliate-disclosure">Affiliate Disclosure</Link><Link href="/corrections-policy">Corrections Policy</Link></nav><small>© 2026 Greener Numbers. Educational information, not financial, tax, legal, or engineering advice.</small></footer>; }

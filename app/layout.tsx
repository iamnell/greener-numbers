import type { Metadata } from "next";
import "./globals.css";
import { BackToTop } from "../components/back-to-top";
import { defaultOpenGraph, siteUrl } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Greener Numbers | The Economics of Going Green",
  description: "Data, tools, and analysis for understanding what energy, transportation, and clean technology actually cost.",
  alternates: { canonical: "/" },
  openGraph: { title: "Greener Numbers | The Economics of Going Green", description: "Clear analysis, useful tools, and honest answers about what going green actually costs.", type: "website", url: "/", ...defaultOpenGraph },
  twitter: { card: "summary_large_image", title: "Greener Numbers", description: "The economics of going green.", images: "/opengraph-image" },
};

const organizationSchema = { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: "Greener Numbers", url: siteUrl, description: "Consumer energy economics tools, data and explainers." }, { "@type": "WebSite", name: "Greener Numbers", url: siteUrl, description: "The economics of going green.", potentialAction: { "@type": "SearchAction", target: `${siteUrl}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } }] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to main content</a>{children}<BackToTop/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /></body></html>; }

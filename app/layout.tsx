import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://greenernumbers.com"),
  title: "Greener Numbers | The Economics of Going Green",
  description: "Data, tools, and analysis for understanding what energy, transportation, and clean technology actually cost.",
  alternates: { canonical: "/" },
  openGraph: { title: "Greener Numbers | The Economics of Going Green", description: "Clear analysis, useful tools, and honest answers about what going green actually costs.", type: "website", url: "/", images: "/opengraph-image" },
  twitter: { card: "summary_large_image", title: "Greener Numbers", description: "The economics of going green.", images: "/opengraph-image" },
};

const organizationSchema = { "@context": "https://schema.org", "@graph": [{ "@type": "Organization", name: "Greener Numbers", url: "https://greenernumbers.com", description: "Consumer energy economics tools, data and explainers." }, { "@type": "WebSite", name: "Greener Numbers", url: "https://greenernumbers.com", description: "The economics of going green." }] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to main content</a>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /></body></html>; }

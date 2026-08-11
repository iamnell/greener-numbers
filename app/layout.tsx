import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Greener Numbers | The Economics of Going Green",
  description: "Data, tools, and analysis for understanding what energy, transportation, and clean technology actually cost.",
  alternates: { canonical: "/" },
  openGraph: { title: "Greener Numbers | The Economics of Going Green", description: "Clear analysis, useful tools, and honest answers about what going green actually costs.", type: "website" },
  twitter: { card: "summary", title: "Greener Numbers", description: "The economics of going green." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }

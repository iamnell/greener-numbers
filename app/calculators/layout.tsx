import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Energy cost calculators | Greener Numbers",
  description: "EV, solar, and electricity cost calculators that keep assumptions visible and explain what each estimate excludes.",
  alternates: { canonical: "/calculators" },
  openGraph: {
    title: "Energy cost calculators | Greener Numbers",
    description: "EV, solar, and electricity cost calculators with visible assumptions.",
    type: "website",
    url: "/calculators",
    images: "/opengraph-image",
  },
  twitter: {
    card: "summary_large_image",
    title: "Energy cost calculators | Greener Numbers",
    description: "EV, solar, and electricity cost calculators with visible assumptions.",
    images: "/opengraph-image",
  },
};

export default function CalculatorsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

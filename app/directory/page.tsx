import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../../components/site-header";
import { Breadcrumbs, NewsletterCTA } from "../../components/platform";

// Server component import (direct TS require)
import { categories, getAllPages } from "../../lib/directory-data";

export const metadata: Metadata = {
  title: "Directory | Greener Numbers",
  description: "Browse all energy calculators, guides, data sources, incentives, news, and videos — organized by topic. EV costs, solar economics, home efficiency, and consumer energy pricing.",
  alternates: { canonical: "/directory" },
  openGraph: {
    title: "Directory | Greener Numbers",
    description: "Browse all energy calculators, guides, data sources, incentives, news, and videos — organized by topic.",
    url: "/directory",
  }
};

// All searchable pages flattened for client-side search filtering
const allPages = getAllPages();
const allTags = [...new Set(allPages.flatMap(p => p.tags))].sort();

export default function DirectoryPage() {
  // Default view: show all categories as cards
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="platform-main">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Directory" }]} />

        {/* Page Hero */}
        <section className="page-hero">
          <p className="eyebrow">Browse everything</p>
          <h1>Greener Numbers Directory</h1>
          <p>All energy calculators, guides, data sources, incentives, news, and videos — organized by topic.</p>
        </section>

        {/* Section: Category Cards */}
        <section className="platform-main platform-section">
          <div className="section-intro">
            <p className="eyebrow">Browse by topic</p>
            <h2>All categories</h2>
          </div>
          <div className="hub-grid compact">
            {categories.map(cat => (
              <Link key={cat.id} href={`#section-${cat.id}`} className="card category-card">
                <span className="category-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
                <p>{cat.description.slice(0, 90)}{cat.description.length > 90 ? "..." : ""}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Section: Detailed Listings per Category */}
        {categories.map(cat => (
          <section key={cat.id} id={`section-${cat.id}`} className="directory-section">
            <div className="section-intro">
              <p className="eyebrow">{cat.icon} {cat.name}</p>
              <h2>{cat.name}</h2>
              <p>{cat.description}</p>
            </div>
            <div className="tool-cards compact">
              {cat.pages.map((page) => (
                <Link key={page.href} href={page.href} className="tool-card directory-item">
                  <span>{page.title}</span>
                  <h3>{page.title}</h3>
                  <p>{page.description}</p>
                  <b>Browse →</b>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <NewsletterCTA />
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleResearch, articles, resourcePages, siteUrl, sourceLinks, stateData } from "../../lib/content";
import { RelatedTools, type RelatedTopic } from "../../components/related-tools";
import { pageMetadata } from "../../lib/site";
import { ArticleByline, articleAuthorJsonLd } from "../../lib/editorial";

export function generateStaticParams() { return [...articles.map(({ slug }) => ({ slug })), ...Object.keys(resourcePages).map((slug) => ({ slug }))]; }

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const article = articles.find((item) => item.slug === slug);
    const resource = resourcePages[slug as keyof typeof resourcePages];
    return article ? pageMetadata({ title: `${article.title} | Greener Numbers`, description: article.dek, path: `/${slug}`, type: "article" }) : resource ? pageMetadata({ title: `${resource.title} | Greener Numbers`, description: resource.intro, path: `/${slug}` }) : {};
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  const resource = resourcePages[slug as keyof typeof resourcePages];
  if (!article && !resource) notFound();
  if (resource) return <main id="main-content" tabIndex={-1} className="article-page"><header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/calculators">Calculators</Link></header><article className="article-body"><p className="eyebrow">{resource.eyebrow}</p><h1>{resource.title}</h1><p className="article-dek">{resource.intro}</p>{resource.sections.map(([heading, text]) => <section key={heading}><h2>{heading}</h2><p>{text}</p></section>)}{slug === "data" && <section><h2>Launch snapshot</h2><div className="simple-table"><div><b>State</b><b>Average retail price</b><b>Typical bill</b></div>{stateData.map((row) => <div key={row.state}><span>{row.state}</span><span>{row.rate}¢/kWh</span><span>${row.bill}</span></div>)}</div></section>}{slug === "methodology" && <section><h2>Primary sources</h2><ul className="source-list">{sourceLinks.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.name} ↗</a><span>{source.note}</span></li>)}</ul></section>}</article><footer className="compact-footer"><Link href="/">← Back to Greener Numbers</Link><Link href="/editorial-standards">Editorial standards</Link></footer></main>;
  if (!article) notFound();
  const research = articleResearch[article.slug];
  const relatedTopic: RelatedTopic = article.slug === "ev-vs-gas-costs" ? "ev" : article.slug === "solar-payback" ? "solar" : "electricity";
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.dek, datePublished: "2026-08-11", dateModified: "2026-08-11", mainEntityOfPage: `${siteUrl}/${article.slug}`, author: articleAuthorJsonLd(), publisher: { "@type": "Organization", name: "Greener Numbers", url: siteUrl } };
  return <main id="main-content" tabIndex={-1} className="article-page">
    <header className="article-header"><Link className="wordmark" href="/"><span>GREENER</span> NUMBERS</Link><Link href="/data">Data & methodology</Link></header>
    <article className="article-body">
      <p className="eyebrow">{article.category} · {article.read}</p>
      <h1>{article.title}</h1><p className="article-dek">{article.dek}</p>
      <ArticleByline publishedAt="2026-08-11" updatedAt="2026-08-11" />
      <p className="article-date">Educational analysis, not financial advice.</p>
      {article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <aside><strong>How we approach this</strong><p>We show assumptions, distinguish average retail prices from a customer’s utility rate, and link primary public sources in our <Link href="/methodology">methodology</Link>.</p></aside>
      <section className="source-ledger"><h2>Sources & assumptions</h2><p><strong>Source release context:</strong> {research.releaseContext}</p><h3>Assumptions and limits</h3><ul>{research.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}</ul><h3>Primary sources</h3><ul className="source-list">{research.sources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.name} ↗</a><span>{source.note}</span></li>)}</ul></section>
      <RelatedTools topic={relatedTopic} />
    </article>
    <footer className="compact-footer"><Link href="/">← Back to Greener Numbers</Link><Link href="/editorial-standards">Editorial standards</Link></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  </main>;
}

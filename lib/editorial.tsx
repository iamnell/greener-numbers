export const editorialAuthor = {
  name: "Greener Numbers Editorial Team",
  slug: "greener-numbers-editorial-team",
  profileUrl: "/authors/greener-numbers-editorial-team",
  description:
    "The Greener Numbers Editorial Team covers the economics of energy, electricity, utilities, transportation, household energy costs, efficiency, and the financial impact of the transition to cleaner energy. Our reporting and Data Briefs rely on primary government, regulatory, utility, and other authoritative data sources whenever possible.",
} as const;

export const editorialCoverage = [
  "Electricity prices",
  "Household energy costs",
  "Utility bills",
  "Natural gas",
  "Gasoline",
  "EV charging",
  "Energy efficiency",
  "Solar economics",
  "Energy incentives",
  "EIA energy data",
  "DOE data",
  "BLS data",
  "FRED economic data",
] as const;

export type ArticleAuthorship = {
  author_name?: string | null;
  author_slug?: string | null;
  reviewed_by?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
};

export function withEditorialDefaults<T extends ArticleAuthorship>(article: T): T & Required<Pick<ArticleAuthorship, "author_name" | "author_slug">> {
  return {
    ...article,
    author_name: article.author_name || editorialAuthor.name,
    author_slug: article.author_slug || editorialAuthor.slug,
  };
}

export function articleAuthorJsonLd(article: ArticleAuthorship = {}) {
  const normalized = withEditorialDefaults(article);
  return {
    "@type": "Organization",
    name: normalized.author_name,
    url: `https://greenernumbers.com${editorialAuthor.profileUrl}`,
  };
}

export function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function ArticleByline({ publishedAt, updatedAt, reviewedBy }: { publishedAt: string; updatedAt?: string; reviewedBy?: string | null }) {
  return <div className="article-byline" aria-label="Article authorship and dates">
    <div>By <a href={editorialAuthor.profileUrl}>{editorialAuthor.name}</a></div>
    <div>Published {formatPublishedDate(publishedAt)}{updatedAt ? ` · Updated ${formatPublishedDate(updatedAt)}` : ""}</div>
    {reviewedBy ? <div>Reviewed by {reviewedBy}</div> : null}
  </div>;
}

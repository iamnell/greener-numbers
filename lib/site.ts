export const siteUrl = "https://greenernumbers.com";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export const defaultOpenGraph = {
  images: "/opengraph-image",
  siteName: "Greener Numbers",
  locale: "en_US",
};

/**
 * Builds a complete per-page Metadata object (title, description, canonical,
 * Open Graph, Twitter card) so social/share previews show this page's own
 * title and URL instead of falling back to the root layout's site-wide
 * defaults. Next.js merges the `openGraph`/`twitter` metadata keys shallowly
 * per top-level key — a page that sets only `title`/`description` does NOT
 * get those values reflected into `openGraph.title`/`openGraph.url`, so it
 * silently inherits whatever the nearest ancestor layout set.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type, ...defaultOpenGraph },
    twitter: { card: "summary_large_image" as const, title, description, images: "/opengraph-image" },
  };
}

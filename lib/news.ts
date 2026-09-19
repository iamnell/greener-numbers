export type PublishedNewsStory = {
  slug: string;
  title: string;
  description: string;
  label: string;
  note: string;
  published_at: string;
};

/**
 * The authoritative website-publication relationship. Draft research stays in
 * content_items, while this query requires a successful website publication.
 */
export async function getPublishedNews(limit = 12): Promise<PublishedNewsStory[]> {
  try {
    const { database } = await import("./db");
    const { rows } = await database().query("select slug,title,summary as description,category as label,published_at from site_news where site=$1 and status='published' order by published_at desc limit $2", ["greenernumbers", limit]);
    return rows.map((story) => ({ ...story, note: "Published automated story" })) as PublishedNewsStory[];
  } catch {
    // A database outage must not turn a public page into a 500. Render an
    // explicit empty state instead of a competing, stale hard-coded list.
    return [];
  }
}

export function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

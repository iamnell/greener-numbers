import { createServerClient } from "./supabase/server";

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
    const { data, error } = await createServerClient()
      .from("content_publications")
      .select("publication_url,published_at,content_items!inner(brand,title,summary,category,article_url)")
      .eq("platform", "website")
      .eq("status", "published")
      .eq("content_items.brand", "greener_numbers")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).flatMap((row) => {
      const item = row.content_items as unknown as { title?: string; summary?: string | null; category?: string | null; article_url?: string | null };
      const url = row.publication_url || item.article_url;
      const slug = url ? new URL(url).pathname.split("/").filter(Boolean).pop() : null;
      if (!slug || !item.title || !row.published_at) return [];
      return [{ slug, title: item.title, description: item.summary || "Source-backed consumer energy reporting.", label: item.category || "Energy news", note: "Published website story", published_at: row.published_at }];
    });
  } catch {
    // A database outage must not turn a public page into a 500. Render an
    // explicit empty state instead of a competing, stale hard-coded list.
    return [];
  }
}

export function formatPublishedDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

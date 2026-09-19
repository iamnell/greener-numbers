import { database } from "../db";

export type AutomatedStory = { title: string; slug: string; summary: string; category: string; published_at: string; story_type: "daily" | "breaking" | "analysis"; is_breaking: boolean; source_name: string; source_url: string; content?: string; last_updated_at?: string | null };

export async function listAutomatedStories(limit = 24): Promise<AutomatedStory[]> {
  try {
    const { rows } = await database().query("select title,slug,summary,category,published_at,story_type,is_breaking,source_name,source_url from site_news where site=$1 and status='published' order by published_at desc limit $2", ["greenernumbers", limit]);
    return rows as AutomatedStory[];
  } catch { return []; }
}

export async function getAutomatedStory(slug: string): Promise<AutomatedStory | null> {
  try {
    const { rows } = await database().query("select title,slug,summary,category,published_at,story_type,is_breaking,source_name,source_url,content,last_updated_at from site_news where site=$1 and status='published' and slug=$2 limit 1", ["greenernumbers", slug]);
    return rows[0] as AutomatedStory | null;
  } catch { return null; }
}

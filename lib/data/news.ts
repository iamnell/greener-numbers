import { createServerClient } from "../supabase/server";

export type AutomatedStory = { title: string; slug: string; summary: string; category: string; published_at: string; story_type: "daily" | "breaking" | "analysis"; is_breaking: boolean; source_name: string; source_url: string; content?: string; last_updated_at?: string | null };

export async function listAutomatedStories(limit = 24): Promise<AutomatedStory[]> {
  try {
    const { data, error } = await createServerClient().from("site_news").select("title,slug,summary,category,published_at,story_type,is_breaking,source_name,source_url").eq("site", "greenernumbers").eq("status", "published").order("published_at", { ascending: false }).limit(limit);
    if (error) throw error;
    return (data ?? []) as AutomatedStory[];
  } catch { return []; }
}

export async function getAutomatedStory(slug: string): Promise<AutomatedStory | null> {
  try {
    const { data, error } = await createServerClient().from("site_news").select("title,slug,summary,category,published_at,story_type,is_breaking,source_name,source_url,content,last_updated_at").eq("site", "greenernumbers").eq("status", "published").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data as AutomatedStory | null;
  } catch { return null; }
}

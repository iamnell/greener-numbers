import { database } from "../db";

export type AutomatedStory = { title: string; slug: string; summary: string; category: string; published_at: string; story_type: "daily" | "breaking" | "analysis"; is_breaking: boolean; source_name: string; source_url: string; content?: string; last_updated_at?: string | null };

const SOURCE_LABELS: Record<string, string> = { "eia.gov": "U.S. Energy Information Administration", "utilitydive.com": "Utility Dive", "energy-storage.news": "Energy-Storage.news", "energy.gov": "U.S. Department of Energy", "ferc.gov": "Federal Energy Regulatory Commission", "epa.gov": "U.S. Environmental Protection Agency", "usda.gov": "U.S. Department of Agriculture", "energy.senate.gov": "U.S. Senate Energy and Natural Resources Committee", "canarymedia.com": "Canary Media" };

// Show the cited publisher, never the intake pipeline. Derived from the source URL so it cannot go stale.
export function sourceLabel(name: string | null | undefined, url: string | null | undefined): string {
  const pipeline = /gemini|bridge|scheduled task|daily brief/i;
  if (name && !pipeline.test(name)) return name;
  try {
    const host = new URL(url || "").hostname.replace(/^www\./, "").toLowerCase();
    const key = Object.keys(SOURCE_LABELS).find((k) => host === k || host.endsWith("." + k));
    return key ? SOURCE_LABELS[key] : host;
  } catch { return name && !pipeline.test(name) ? name : "Cited source"; }
}

export async function listAutomatedStories(limit = 24): Promise<AutomatedStory[]> {
  try {
    const { rows } = await database().query("select title,slug,summary,category,published_at,story_type,is_breaking,source_name,source_url from site_news where site=$1 and status='published' order by published_at desc limit $2", ["greenernumbers", limit]);
    return (rows as AutomatedStory[]).map((row) => ({ ...row, source_name: sourceLabel(row.source_name, row.source_url) }));
  } catch { return []; }
}

export async function getAutomatedStory(slug: string): Promise<AutomatedStory | null> {
  try {
    const { rows } = await database().query("select title,slug,summary,category,published_at,story_type,is_breaking,source_name,source_url,content,last_updated_at from site_news where site=$1 and status='published' and slug=$2 limit 1", ["greenernumbers", slug]);
    const row = rows[0] as AutomatedStory | undefined; return row ? { ...row, source_name: sourceLabel(row.source_name, row.source_url) } : null;
  } catch { return null; }
}

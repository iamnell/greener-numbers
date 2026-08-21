import type { Metadata } from "next";
import { TrustPage } from "../../components/trust-page";
import { pageMetadata } from "../../lib/site";

export const metadata: Metadata = pageMetadata({ title: "Editorial policy | Greener Numbers", description: "How Greener Numbers researches, reviews, cites, updates, and corrects source-backed editorial coverage.", path: "/editorial-policy" });

export default function Editorial() {
  return <TrustPage eyebrow="Editorial policy" title="Clear sources. Clear assumptions. Clear corrections." intro="Greener Numbers publishes consumer energy economics coverage designed to be useful, source-backed, and understandable. The editorial team remains responsible for what we publish." sections={[
    ["Independence", "Editorial conclusions are not sold to advertisers, vendors, or political campaigns. Any paid or sponsored material will be visibly labeled."],
    ["Evidence and source traceability", "We prefer original government data, public filings, regulatory records, utility materials, and peer-reviewed research. Material factual claims should link to the underlying source, and estimates should state their inputs and limits."],
    ["Automation transparency", "Greener Numbers may use automated tools to monitor authoritative sources, retrieve public data, identify relevant developments, assist with summarization, assist with drafting, and update data. Automated tools are not listed as authors, and no AI model is represented as a human author. Sources should remain clearly cited and factual claims traceable to their underlying source."],
    ["Authorship and review", "Automatically researched, generated, or published News, Breaking News, Data Briefs, and energy-data updates are authored by the Greener Numbers Editorial Team. A named human reviewer appears only when an actual human review has occurred."],
    ["Corrections and updates", "If a source changes or an error is identified, we update the page, preserve the published and updated dates, and explain a material correction or methodology change in the article or data note."],
  ]} />;
}

import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../../../components/site-header";
import { Breadcrumbs } from "../../../components/platform";
import { pageMetadata } from "../../../lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Home energy rebates: sources and caveats | Greener Numbers",
  description: "Every source behind the Greener Numbers video on federal home energy rebates, with what each one supports and what we left out.",
  path: "/guides/home-energy-rebates-sources",
});

const rows: ReadonlyArray<readonly [string, ReadonlyArray<readonly [string, string]>]> = [
  ["HOMES: up to $8,000, minimum 20% modeled savings, all income levels, upgrade types. Grantees may increase the amount for households under 80% AMI (footnote).", [["DOE Home Energy Rebates program page", "https://www.energy.gov/cmei/scep/home-energy-rebates-program"]]],
  ["HEEHR: up to $14,000, at point of sale through retailers or contractors, for covered items.", [["DOE Home Energy Rebates program page", "https://www.energy.gov/cmei/scep/home-energy-rebates-program"]]],
  ["Available in select states, with more details coming soon. The state, territory or Tribe runs its own program.", [["DOE Home Energy Rebates program page", "https://www.energy.gov/cmei/scep/home-energy-rebates-program"], ["DOE Home Upgrades page (states manage rebates)", "https://www.energy.gov/save/home-upgrades"]]],
  ["Program name change. No fuel switching. Keep fossil HVAC when adding a heat pump. Insulation first. Combo washer-dryers. DIY retail except HVAC. The 40% low-income reserve is removed. Launched programs align within 3 months. Existing reservations are honored. No combining with other federal grants or rebates (footnote 3, 42 U.S.C. 18795a(c)(8)).", [["DOE Program Notice 26-2, effective May 29, 2026", "https://www.energy.gov/documents/program-notice-26-2"]]],
  ["HOMES: the ENERGY STAR requirement is optional. The geotag photo requirement is removed. Same 3-month alignment.", [["DOE Program Notice 26-1, effective May 29, 2026", "https://www.energy.gov/documents/program-notice-26-1"]]],
  ["Income tiers (under 80% AMI is low income, 80% to 150% is moderate; HUD AMI; categorical eligibility). HOMES modeled-savings table for single-family homes (Table 2).", [["DOE Program Requirements and Application Instructions, v2.1, December 16, 2024", "https://www.energy.gov/sites/default/files/2024-12/program-requirements-and-application-instructions_121624.pdf.pdf"]]],
  ["HEEHR covers up to 100% of cost for lower income and 50% for moderate income. Per-item maximums. Wait for your program to launch. Work after August 16, 2022 may qualify. 150% AMI limit.", [["DOE Home Energy Rebates FAQ and fact sheet, December 2024", "https://www.energy.gov/sites/default/files/2024-12/home-energy-rebates-faq-fact-sheet_925224.pdf"]]],
  ["Completion deadline of September 30, 2031, quoting the statute.", [["DOE Program Requirements PDF, Section 3.1.1 and footnote text", "https://www.energy.gov/sites/default/files/2024-12/program-requirements-and-application-instructions_121624.pdf.pdf"]]],
  ["West Virginia: statewide launch September 28, 2026. $88M. First program under the new guidance. About 10,000 homes. Judy Fry example: 33.5% and $102, reported by the state. Income tiers.", [["West Virginia Governor's office press release", "https://governor.wv.gov/article/governor-morrisey-launches-statewide-home-energy-rebate-programs-lower-utility-costs-west-0"]]],
  ["Rhode Island: September 23, 2026. $32M for HOMES. Multifamily buildings of 5 or more units. Up to $16,000 per unit for a heat pump grant.", [["Rhode Island Office of Energy Resources press release", "https://energy.ri.gov/press-releases/rhode-island-office-energy-resources-launches-32-million-federal-home-owner-managing"]]],
];

const caveats: readonly string[] = [
  "Some figures come from December 2024 DOE documents. The May 2026 notices replace parts of them (fuel switching and the 40% low-income reserve). The video calls these the December 2024 rules and says states set their own details. The per-item caps and the HOMES table are not restated in the May notices we read, so we present them as the framework, not as current guarantees.",
  "Judy Fry's figures (33.5% and $102) come from a governor's press release and were reported by the state. We did not verify them independently.",
  "The DOE publishes no state-by-state list of which programs are live. More states may launch in the coming weeks, so check your state energy office before you plan around a rebate.",
  "Amounts shown as \"up to\" are maximums, not what a typical household gets.",
  "The \"3 months\" alignment window comes from the notice text. We did not turn it into a calendar date.",
  "Left out: a Wisconsin retail rebate item (the release text is from October 2025), the DOE Home Upgrades page for tax credit claims (dated 2024), and aggregator sites. The video does not cover tax credits.",
];

export default function HomeEnergyRebatesSources() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="platform-main">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: "Home energy rebates sources" }]} />
        <section className="page-hero">
          <p className="eyebrow">Sources</p>
          <h1>Home energy rebates: sources and caveats</h1>
          <p>Every claim in our video on federal home energy rebates, with the page it came from. All pages were read live on October 5, 2026.</p>
        </section>
        <section className="content-sections">
          <section>
            <h2>Claims and sources</h2>
            {rows.map(([claim, links]) => (
              <p key={claim}>
                {claim}{" "}
                {links.map(([label, href], i) => (
                  <span key={href + label}>
                    {i > 0 ? "; " : ""}
                    <a href={href} rel="noopener noreferrer">{label}</a>
                  </span>
                ))}
              </p>
            ))}
          </section>
          <section>
            <h2>Caveats and what we left out</h2>
            {caveats.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </section>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

import { db, requireCron, response, runEnd, runStart } from "../_shared/greener.ts";
const programs = [
  ["clean-vehicle-credit", "https://www.irs.gov/credits-deductions/credits-for-new-clean-vehicles-purchased-in-2023-or-after"],
  ["refueling-property-credit", "https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit"],
] as const;
Deno.serve(async (req) => { const denied = requireCron(req); if (denied) return denied; const id = await runStart("update-green-incentives"); try { let updated = 0;
  for (const [source_record_id, source_url] of programs) { const res = await fetch(source_url, { method: "HEAD", signal: AbortSignal.timeout(12_000), redirect: "follow" }); if (!res.ok) continue; const { error } = await db.from("ev_incentives").update({ source_url: res.url, source_updated_at: new Date().toISOString(), last_checked_at: new Date().toISOString() }).eq("source_publisher", "Internal Revenue Service").eq("source_record_id", source_record_id); if (error) throw error; updated++; }
  await runEnd(id, updated === programs.length ? "success" : "partial", { updated }, undefined, { verified: "IRS official program URLs only; eligibility is not parsed or inferred" }); return response({ verified: updated });
} catch (e) { await runEnd(id, "failed", {}, e); return response({ error: "incentive verification failed" }, 500); } });

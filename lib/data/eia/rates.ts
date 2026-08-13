import { nationalElectricity, stateMetrics } from "../energy";

export type ElectricityRate = { centsPerKwh: number; source: string; updated: string; fallback: boolean };
const EIA_URL = "https://api.eia.gov/v2/electricity/retail-sales/data/";

/** Server-only EIA adapter. A missing key or upstream failure intentionally returns the labelled launch snapshot. */
export async function getResidentialRate(state?: string): Promise<ElectricityRate> {
  const fallback = stateMetrics.find((metric) => metric.slug === state)?.rate ?? nationalElectricity.rate;
  const apiKey = process.env.EIA_API_KEY;
  if (!apiKey) return { centsPerKwh: fallback, source: "EIA launch snapshot", updated: "2026-08-11", fallback: true };
  try {
    const params = new URLSearchParams({ api_key: apiKey, frequency: "monthly", data: "price", facets: "sectorid=RES", "sort[0][column]": "period", "sort[0][direction]": "desc", length: "1" });
    if (state) params.set("facets[stateid][]", state.toUpperCase());
    const response = await fetch(`${EIA_URL}?${params}`, { next: { revalidate: 60 * 60 * 24 } });
    if (!response.ok) throw new Error(`EIA ${response.status}`);
    const data = await response.json() as { response?: { data?: Array<{ price?: string; period?: string }> } };
    const record = data.response?.data?.[0]; const price = Number(record?.price);
    if (!Number.isFinite(price)) throw new Error("EIA returned no price");
    return { centsPerKwh: price, source: "U.S. Energy Information Administration", updated: record?.period ?? "latest available", fallback: false };
  } catch { return { centsPerKwh: fallback, source: "EIA launch snapshot (live refresh unavailable)", updated: "2026-08-11", fallback: true }; }
}

type EiaHourlyRow = { period: string; value: string; "value-units": string };
type EiaRetailRow = { period: string; price: string; "price-units": string };

export type GridDemandPoint = { period: string; megawattHours: number };
export type EnergyNowData = {
  demand: GridDemandPoint[];
  demandUpdatedAt: string;
  residentialPrice: { centsPerKwh: number; period: string } | null;
};

const API = "https://api.eia.gov/v2";
const GRID_SOURCE = "https://www.eia.gov/electricity/gridmonitor/";
const RETAIL_SOURCE = "https://www.eia.gov/electricity/data.php";

function eiaUrl(path: string, params: Record<string, string>) {
  const query = new URLSearchParams(params);
  return `${API}${path}?${query.toString()}`;
}

function dateHour(daysAgo: number) {
  const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 13);
}

function humanMonth(period: string) {
  const [year, month] = period.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export async function getEnergyNowData(): Promise<EnergyNowData | null> {
  const apiKey = process.env.EIA_API_KEY;
  if (!apiKey) return null;

  try {
    const demandUrl = eiaUrl("/electricity/rto/region-data/data/", {
      api_key: apiKey,
      frequency: "hourly",
      "data[0]": "value",
      "facets[type][]": "D",
      "facets[respondent][]": "US48",
      start: dateHour(4),
      end: dateHour(0),
      length: "96",
      "sort[0][column]": "period",
      "sort[0][direction]": "asc",
    });
    const retailUrl = eiaUrl("/electricity/retail-sales/data/", {
      api_key: apiKey,
      frequency: "monthly",
      "data[0]": "price",
      "facets[sectorid][]": "RES",
      "facets[stateid][]": "US",
      length: "1",
      "sort[0][column]": "period",
      "sort[0][direction]": "desc",
    });

    const [demandResponse, retailResponse] = await Promise.all([
      fetch(demandUrl, { next: { revalidate: 3600 } }),
      fetch(retailUrl, { next: { revalidate: 86400 } }),
    ]);
    if (!demandResponse.ok) return null;

    const demandPayload = await demandResponse.json() as { response?: { data?: EiaHourlyRow[] } };
    const demand = (demandPayload.response?.data ?? [])
      .map((row) => ({ period: row.period, megawattHours: Number(row.value) }))
      .filter((row) => Number.isFinite(row.megawattHours));
    if (demand.length < 2) return null;

    let residentialPrice: EnergyNowData["residentialPrice"] = null;
    if (retailResponse.ok) {
      const retailPayload = await retailResponse.json() as { response?: { data?: EiaRetailRow[] } };
      const row = retailPayload.response?.data?.[0];
      if (row && Number.isFinite(Number(row.price))) residentialPrice = { centsPerKwh: Number(row.price), period: humanMonth(row.period) };
    }

    return { demand, demandUpdatedAt: demand[demand.length - 1].period, residentialPrice };
  } catch {
    return null;
  }
}

export async function getUsResidentialRateDefault(): Promise<{ centsPerKwh: number; period: string } | null> {
  const apiKey = process.env.EIA_API_KEY;
  if (!apiKey) return null;
  try {
    const url = eiaUrl("/electricity/retail-sales/data/", { api_key: apiKey, frequency: "monthly", "data[0]": "price", "facets[sectorid][]": "RES", "facets[stateid][]": "US", length: "1", "sort[0][column]": "period", "sort[0][direction]": "desc" });
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return null;
    const payload = await response.json() as { response?: { data?: EiaRetailRow[] } };
    const row = payload.response?.data?.[0];
    return row && Number.isFinite(Number(row.price)) ? { centsPerKwh: Number(row.price), period: humanMonth(row.period) } : null;
  } catch { return null; }
}

/** Server-only refresh record for durable rate caching. */
export async function getUsResidentialRateRefreshRecord(): Promise<{ centsPerKwh: number; period: string } | null> {
  const apiKey = process.env.EIA_API_KEY;
  if (!apiKey) return null;
  try {
    const url = eiaUrl("/electricity/retail-sales/data/", { api_key: apiKey, frequency: "monthly", "data[0]": "price", "facets[sectorid][]": "RES", "facets[stateid][]": "US", length: "1", "sort[0][column]": "period", "sort[0][direction]": "desc" });
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json() as { response?: { data?: EiaRetailRow[] } };
    const row = payload.response?.data?.[0];
    if (!row || !/^\d{4}-\d{2}$/.test(row.period) || !Number.isFinite(Number(row.price))) return null;
    return { centsPerKwh: Number(row.price), period: `${row.period}-01` };
  } catch { return null; }
}

export const eiaSources = { grid: GRID_SOURCE, retail: RETAIL_SOURCE };

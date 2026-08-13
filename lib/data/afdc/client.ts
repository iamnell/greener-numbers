export type ChargingStation = { id: string; name: string; address: string; city: string; state: string; postalCode: string; latitude?: number; longitude?: number; access: string; network?: string; connectors: string[]; level2Ports?: number; dcFastPorts?: number; sourceUpdatedAt?: string };

const AFDC_URL = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json";
/** Server-only AFDC/NREL adapter. NREL_API_KEY is deliberately never sent to the browser. */
export async function findChargingStations(location: string, limit = 20): Promise<{ stations: ChargingStation[]; source: string; updated: string; fallback: boolean }> {
  const apiKey = process.env.NREL_API_KEY;
  if (!apiKey || !location.trim()) return { stations: [], source: "DOE Alternative Fuels Data Center", updated: "Search requires configuration", fallback: true };
  try {
    const params = new URLSearchParams({ api_key: apiKey, fuel_type: "ELEC", access: "public", location, limit: String(Math.min(Math.max(limit, 1), 50)), status: "E" });
    const response = await fetch(`${AFDC_URL}?${params}`, { next: { revalidate: 60 * 30 } });
    if (!response.ok) throw new Error(`AFDC ${response.status}`);
    const data = await response.json() as { fuel_stations?: Array<Record<string, unknown>> };
    const stations = (data.fuel_stations ?? []).map((item) => ({ id: String(item.id), name: String(item.station_name ?? "Charging station"), address: String(item.street_address ?? ""), city: String(item.city ?? ""), state: String(item.state ?? ""), postalCode: String(item.zip ?? ""), latitude: typeof item.latitude === "number" ? item.latitude : undefined, longitude: typeof item.longitude === "number" ? item.longitude : undefined, access: String(item.access_days_time ?? "Access details unavailable"), network: typeof item.ev_network === "string" ? item.ev_network : undefined, connectors: typeof item.ev_connector_types === "string" ? item.ev_connector_types.split(",") : [], level2Ports: typeof item.ev_level2_evse_num === "number" ? item.ev_level2_evse_num : undefined, dcFastPorts: typeof item.ev_dc_fast_num === "number" ? item.ev_dc_fast_num : undefined, sourceUpdatedAt: typeof item.open_date === "string" ? item.open_date : undefined }));
    return { stations, source: "DOE Alternative Fuels Data Center / NREL", updated: new Date().toISOString().slice(0, 10), fallback: false };
  } catch { return { stations: [], source: "DOE Alternative Fuels Data Center (temporarily unavailable)", updated: new Date().toISOString().slice(0, 10), fallback: true }; }
}

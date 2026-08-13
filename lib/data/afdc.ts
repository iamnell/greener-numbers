type AfdcStation = { id: number; station_name?: string; street_address?: string; city?: string; state?: string; zip?: string; access_code?: string; access_days_time?: string; ev_connector_types?: string[]; ev_dc_fast_num?: number; ev_level2_evse_num?: number; ev_network?: string; ev_network_web?: string; latitude?: number; longitude?: number; date_last_confirmed?: string; status_code?: string };
export type ChargerStation = { id: number; name: string; address: string; access: string; connectors: string[]; level2Ports: number; dcFastPorts: number; network: string | null; networkUrl: string | null; latitude: number | null; longitude: number | null; lastConfirmed: string | null; status: string | null };

const API = "https://developer.nlr.gov/api/alt-fuel-stations/v1.json";
export async function findElectricStations(zip: string, limit = 25): Promise<ChargerStation[]> {
  const apiKey = process.env.NREL_API_KEY;
  if (!apiKey) throw new Error("NREL_NOT_CONFIGURED");
  const normalizedZip = zip.trim().replace(/\s+/g, "");
  if (!/^\d{5}(?:-\d{4})?$/.test(normalizedZip)) throw new Error("INVALID_ZIP");
  const query = new URLSearchParams({ api_key: apiKey, fuel_type: "ELEC", zip: normalizedZip, access: "public", status: "E", limit: String(Math.min(Math.max(limit, 1), 50)) });
  const response = await fetch(`${API}?${query.toString()}`, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error("AFDC_UNAVAILABLE");
  const payload = await response.json() as { fuel_stations?: AfdcStation[] };
  return (payload.fuel_stations ?? []).map((station) => ({ id: station.id, name: station.station_name ?? "Unnamed charging station", address: [station.street_address, station.city, station.state, station.zip].filter(Boolean).join(", "), access: station.access_code === "public" ? "Public access" : station.access_code ?? "Access not reported", connectors: station.ev_connector_types ?? [], level2Ports: Number(station.ev_level2_evse_num ?? 0), dcFastPorts: Number(station.ev_dc_fast_num ?? 0), network: station.ev_network ?? null, networkUrl: station.ev_network_web ?? null, latitude: Number.isFinite(station.latitude) ? station.latitude ?? null : null, longitude: Number.isFinite(station.longitude) ? station.longitude ?? null : null, lastConfirmed: station.date_last_confirmed ?? null, status: station.status_code ?? null }));
}

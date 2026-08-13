import { NextRequest, NextResponse } from "next/server";
import { findElectricStations } from "../../../../lib/data/afdc";

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get("zip") ?? "";
  try { return NextResponse.json({ stations: await findElectricStations(zip), source: "DOE Alternative Fuels Data Center / NREL", retrievedAt: new Date().toISOString() }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }); }
  catch (error) { const code = error instanceof Error ? error.message : "AFDC_UNAVAILABLE"; const status = code === "INVALID_ZIP" ? 400 : code === "NREL_NOT_CONFIGURED" ? 503 : 502; return NextResponse.json({ error: code, message: code === "INVALID_ZIP" ? "Enter a valid five-digit U.S. ZIP code." : code === "NREL_NOT_CONFIGURED" ? "The authoritative station feed is not configured yet." : "The official station feed is temporarily unavailable." }, { status }); }
}

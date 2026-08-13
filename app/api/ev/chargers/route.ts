import { NextRequest, NextResponse } from "next/server";
import { findChargingStations } from "../../../../lib/data/afdc/client";
export async function GET(request: NextRequest) { const location = request.nextUrl.searchParams.get("location")?.slice(0, 120) ?? ""; if (!location) return NextResponse.json({ stations: [], error: "Enter a ZIP code, city, or state." }, { status: 400 }); const result = await findChargingStations(location); return NextResponse.json(result, { headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } }); }

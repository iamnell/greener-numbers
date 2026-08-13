import { NextRequest, NextResponse } from "next/server";
import { getUsResidentialRateRefreshRecord } from "../../../../lib/data/eia";
import { createServerClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const rate = await getUsResidentialRateRefreshRecord();
  if (!rate) return NextResponse.json({ message: "EIA rate unavailable" }, { status: 502 });
  try {
    const client = createServerClient();
    const { error: rateError } = await client.from("electricity_rates").upsert({ geography_type: "national", geography_code: "US", sector: "residential", cents_per_kwh: rate.centsPerKwh, period: rate.period, source_url: "https://www.eia.gov/electricity/data.php", source_updated_at: rate.period, last_checked_at: new Date().toISOString() }, { onConflict: "geography_type,geography_code,sector,period" });
    if (rateError) throw rateError;
    const { error: updateError } = await client.from("data_source_updates").insert({ provider: "EIA", dataset: "electricity-retail-sales-residential-us", status: "success", records_processed: 1, source_updated_at: rate.period, detail: "National residential electricity rate refreshed." });
    if (updateError) throw updateError;
    return NextResponse.json({ refreshed: true, period: rate.period, centsPerKwh: rate.centsPerKwh });
  } catch {
    return NextResponse.json({ message: "Rate cache unavailable" }, { status: 503 });
  }
}

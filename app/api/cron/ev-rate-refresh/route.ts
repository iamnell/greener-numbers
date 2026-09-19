import { NextRequest, NextResponse } from "next/server";
import { getUsResidentialRateRefreshRecord } from "../../../../lib/data/eia";
import { database } from "../../../../lib/db";

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
    const client = database();
    await client.query("insert into electricity_rates (geography_type,geography_code,sector,cents_per_kwh,period,source_url,source_updated_at,last_checked_at) values ('national','US','residential',$1,$2,'https://www.eia.gov/electricity/data.php',$2,$3) on conflict (geography_type,geography_code,sector,period) do update set cents_per_kwh=excluded.cents_per_kwh,source_updated_at=excluded.source_updated_at,last_checked_at=excluded.last_checked_at", [rate.centsPerKwh,rate.period,new Date().toISOString()]);
    await client.query("insert into data_source_updates (provider,dataset,status,records_processed,source_updated_at,detail) values ('EIA','electricity-retail-sales-residential-us','success',1,$1,'National residential electricity rate refreshed.')", [rate.period]);
    return NextResponse.json({ refreshed: true, period: rate.period, centsPerKwh: rate.centsPerKwh });
  } catch {
    return NextResponse.json({ message: "Rate cache unavailable" }, { status: 503 });
  }
}

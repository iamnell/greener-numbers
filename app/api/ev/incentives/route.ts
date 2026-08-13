import { NextRequest, NextResponse } from "next/server";
import { listVerifiedIncentives } from "../../../../lib/data/ev-data";

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state") ?? undefined;
  try {
    const incentives = await listVerifiedIncentives(state);
    return NextResponse.json({ incentives, retrievedAt: new Date().toISOString() }, { headers: { "Cache-Control": "private, max-age=0, s-maxage=3600" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "INCENTIVES_READ_FAILED";
    const status = message === "INVALID_STATE" ? 400 : 503;
    return NextResponse.json({ message: status === 400 ? "Use a two-letter U.S. state abbreviation." : "Verified incentive records are temporarily unavailable." }, { status });
  }
}

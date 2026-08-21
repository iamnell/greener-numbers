import { NextRequest, NextResponse } from "next/server";
import { syncYouTubeVideos } from "../../../../lib/videos";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await syncYouTubeVideos());
  } catch (error) {
    console.error("YouTube video synchronization failed", error);
    return NextResponse.json({ success: false, message: "YouTube synchronization failed" }, { status: 503 });
  }
}

export const POST = GET;

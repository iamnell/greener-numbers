import { NextRequest, NextResponse } from "next/server";

/** Keep the public hostname, canonical URLs, and shared links consistent. */
export function proxy(request: NextRequest) {
  if (request.nextUrl.hostname === "www.greenernumbers.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "greenernumbers.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

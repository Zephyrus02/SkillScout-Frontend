import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/:path*"],
};

export function middleware(req: NextRequest) {
  // CVE-2025-29927: strip the internal subrequest header so external callers
  // cannot spoof it to bypass middleware execution.
  const headers = new Headers(req.headers);
  headers.delete("x-middleware-subrequest");

  const key = process.env.INDEXNOW_KEY;
  if (key && req.nextUrl.pathname === `/${key}.txt`) {
    return new NextResponse(`${key}\n`, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=86400, immutable",
      },
    });
  }

  return NextResponse.next({
    request: { headers },
  });
}

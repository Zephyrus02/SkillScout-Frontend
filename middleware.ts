import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/:path*"],
};

export function middleware(req: NextRequest) {
  const key = process.env.INDEXNOW_KEY;
  if (key && req.nextUrl.pathname === `/${key}.txt`) {
    return new NextResponse(`${key}\n`, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        // Key file should be stable and cacheable
        "cache-control": "public, max-age=86400, immutable",
      },
    });
  }

  return NextResponse.next();
}

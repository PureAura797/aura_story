import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "pa_admin_token";

/**
 * Edge-compatible middleware — checks only cookie presence.
 * Full session validation happens server-side in API routes (Node.js runtime).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes (except login, recovery, and API)
  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !pathname.startsWith("/admin/recovery") &&
    !pathname.startsWith("/api/")
  ) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

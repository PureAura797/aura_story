import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "pa_admin_token";
const TOKEN_VALUE = "pa_authenticated_session";

/* ─── Cookie Management (Edge-safe) ─── */
export async function setAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, TOKEN_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value === TOKEN_VALUE;
}

export function isAdminAuthenticatedFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME);
  return token?.value === TOKEN_VALUE;
}

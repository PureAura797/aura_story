import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { supabaseAdmin } from "./supabase";

const COOKIE_NAME = "pa_admin_token";
const MAX_SESSIONS = 3;
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/* ─── Helpers ─── */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/* ─── Session Storage (Supabase) ─── */
async function readSessions() {
  try {
    const { data } = await supabaseAdmin
      .from("admin_sessions")
      .select("*")
      .gte("expires_at", new Date().toISOString());
    return data || [];
  } catch {
    return [];
  }
}

async function addSession(tokenHash: string, ip?: string, ua?: string) {
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_MAX_AGE * 1000);

  // Enforce max sessions — delete oldest if over limit
  const sessions = await readSessions();
  if (sessions.length >= MAX_SESSIONS) {
    const sorted = sessions.sort(
      (a: { created_at: string }, b: { created_at: string }) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const toDelete = sorted.slice(0, sorted.length - MAX_SESSIONS + 1);
    for (const s of toDelete) {
      await supabaseAdmin
        .from("admin_sessions")
        .delete()
        .eq("token_hash", (s as { token_hash: string }).token_hash);
    }
  }

  await supabaseAdmin.from("admin_sessions").insert({
    token_hash: tokenHash,
    ip: ip || null,
    ua: ua ? ua.substring(0, 100) : null,
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
  });
}

async function deleteSession(tokenHash: string) {
  await supabaseAdmin
    .from("admin_sessions")
    .delete()
    .eq("token_hash", tokenHash);
}

async function sessionExists(tokenHash: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("admin_sessions")
    .select("token_hash")
    .eq("token_hash", tokenHash)
    .gte("expires_at", new Date().toISOString())
    .single();
  return !!data;
}

/* ─── Cookie Management ─── */
export async function setAdminCookie(ip?: string, ua?: string): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHashed = hashToken(token);

  await addSession(tokenHashed, ip, ua);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    await deleteSession(hashToken(token));
  }

  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return sessionExists(hashToken(token));
}

export async function isAdminAuthenticatedFromRequest(
  request: NextRequest
): Promise<boolean> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return sessionExists(hashToken(token));
}

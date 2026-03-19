import crypto from "crypto";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const COOKIE_NAME = "pa_admin_token";
const DATA_DIR = path.join(process.cwd(), "src", "data");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");
const MAX_SESSIONS = 3; // max concurrent sessions
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/* ─── Session Storage ─── */
interface Session {
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  ip?: string;
  ua?: string;
}

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch { /* read-only FS (Vercel) */ }
}

function readSessions(): Session[] {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_FILE, "utf-8"));
    }
  } catch { /* read-only FS (Vercel) */ }
  return [];
}

function writeSessions(sessions: Session[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch {
    console.log("[admin-auth] Read-only FS, skipping session write");
  }
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** Remove expired sessions */
function pruneExpired(sessions: Session[]): Session[] {
  const now = new Date();
  return sessions.filter((s) => new Date(s.expiresAt) > now);
}

/* ─── Cookie Management ─── */
export async function setAdminCookie(ip?: string, ua?: string): Promise<void> {
  // Generate cryptographically random token
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHashed = hashToken(token);
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_MAX_AGE * 1000);

  // Store session server-side
  let sessions = pruneExpired(readSessions());

  // Enforce max concurrent sessions (remove oldest if over limit)
  if (sessions.length >= MAX_SESSIONS) {
    sessions.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    sessions = sessions.slice(sessions.length - MAX_SESSIONS + 1);
  }

  sessions.push({
    tokenHash: tokenHashed,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    ip: ip || undefined,
    ua: ua ? ua.substring(0, 100) : undefined,
  });

  writeSessions(sessions);

  // Set token in cookie
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

  // Remove session from server storage
  if (token) {
    const hashed = hashToken(token);
    let sessions = readSessions();
    sessions = sessions.filter((s) => s.tokenHash !== hashed);
    writeSessions(sessions);
  }

  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const hashed = hashToken(token);
  const sessions = pruneExpired(readSessions());
  return sessions.some((s) => s.tokenHash === hashed);
}

export function isAdminAuthenticatedFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const hashed = hashToken(token);
  const sessions = pruneExpired(readSessions());
  return sessions.some((s) => s.tokenHash === hashed);
}

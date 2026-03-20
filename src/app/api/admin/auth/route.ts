import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie, clearAdminCookie } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/admin-password";
import { checkRateLimit, LOGIN_LIMIT } from "@/lib/rate-limiter";
import { is2FAEnabled, verifyTOTP, verifyBackupCode } from "@/lib/admin-totp";
import crypto from "crypto";

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

/* ─── Temporary token store for 2FA step ─── */
const pendingTokens = new Map<string, { ip: string; ua: string; expiresAt: number }>();

// Cleanup expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of pendingTokens) {
    if (val.expiresAt < now) pendingTokens.delete(key);
  }
}, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, action, tempToken, code } = body;

    /* ── Logout ── */
    if (action === "logout") {
      await clearAdminCookie();
      return NextResponse.json({ success: true });
    }

    /* ── Verify TOTP (step 2 of login) ── */
    if (action === "verify-totp") {
      if (!tempToken || !code) {
        return NextResponse.json({ error: "Введите код" }, { status: 400 });
      }

      const pending = pendingTokens.get(tempToken);
      if (!pending || pending.expiresAt < Date.now()) {
        pendingTokens.delete(tempToken);
        return NextResponse.json(
          { error: "Истекло время. Войдите заново.", expired: true },
          { status: 401 }
        );
      }

      // Try TOTP first, then backup code
      const isValidTOTP = await verifyTOTP(code);
      const isValidBackup = !isValidTOTP && code.length === 8 && await verifyBackupCode(code);

      if (!isValidTOTP && !isValidBackup) {
        return NextResponse.json({ error: "Неверный код" }, { status: 401 });
      }

      // Success — create session
      pendingTokens.delete(tempToken);
      await setAdminCookie(pending.ip, pending.ua);
      return NextResponse.json({ success: true });
    }

    /* ── Password login (step 1) ── */
    const ip = getClientIP(request);
    const limit = checkRateLimit(ip, LOGIN_LIMIT);

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Слишком много попыток. Попробуйте через ${Math.ceil(limit.retryAfterSeconds / 60)} мин.` },
        {
          status: 429,
          headers: {
            "Retry-After": limit.retryAfterSeconds.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    if (!password || !(await verifyPassword(password))) {
      return NextResponse.json(
        { error: "Неверный пароль" },
        {
          status: 401,
          headers: { "X-RateLimit-Remaining": limit.remaining.toString() },
        }
      );
    }

    const ua = request.headers.get("user-agent") || "";

    // Check if 2FA is enabled
    const has2FA = await is2FAEnabled();

    if (has2FA) {
      // Don't create session yet — issue temp token for TOTP step
      const token = crypto.randomBytes(32).toString("hex");
      pendingTokens.set(token, {
        ip,
        ua,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 min TTL
      });
      return NextResponse.json({ requires2FA: true, tempToken: token });
    }

    // No 2FA — create session directly
    await setAdminCookie(ip, ua);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

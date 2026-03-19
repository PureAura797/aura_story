import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie, clearAdminCookie } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/admin-password";
import { checkRateLimit, LOGIN_LIMIT } from "@/lib/rate-limiter";

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, action } = body;

    if (action === "logout") {
      await clearAdminCookie();
      return NextResponse.json({ success: true });
    }

    // ── Rate limit check ──
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

    if (!password || !verifyPassword(password)) {
      return NextResponse.json(
        { error: "Неверный пароль" },
        {
          status: 401,
          headers: { "X-RateLimit-Remaining": limit.remaining.toString() },
        }
      );
    }

    const ua = request.headers.get("user-agent") || "";
    await setAdminCookie(ip, ua);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { changePassword, createRecoveryCode, resetPasswordWithCode } from "@/lib/admin-password";
import { checkRateLimit, RECOVERY_LIMIT, RECOVERY_VERIFY_LIMIT } from "@/lib/rate-limiter";

function getClientIP(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    const ip = getClientIP(request);

    // ─── Change password (requires auth) ───
    if (action === "change") {
      if (!(await isAdminAuthenticatedFromRequest(request))) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
      }

      const result = await changePassword(currentPassword, newPassword);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    // ─── Request recovery code (rate limited) ───
    if (action === "request_recovery") {
      const limit = checkRateLimit(ip, RECOVERY_LIMIT);
      if (!limit.allowed) {
        return NextResponse.json(
          { error: `Слишком много запросов. Попробуйте через ${Math.ceil(limit.retryAfterSeconds / 60)} мин.` },
          { status: 429, headers: { "Retry-After": limit.retryAfterSeconds.toString() } }
        );
      }

      const { email } = body;
      if (!email || !email.includes("@")) {
        return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
      }

      const result = await createRecoveryCode(email);
      return NextResponse.json({
        success: true,
        emailSent: result.emailSent,
        message: result.emailSent
          ? "Код отправлен на почту"
          : "Код создан (проверьте консоль сервера — SMTP не настроен)",
      });
    }

    // ─── Reset password with code (rate limited) ───
    if (action === "reset") {
      const limit = checkRateLimit(ip, RECOVERY_VERIFY_LIMIT);
      if (!limit.allowed) {
        return NextResponse.json(
          { error: `Слишком много попыток. Попробуйте через ${Math.ceil(limit.retryAfterSeconds / 60)} мин.` },
          { status: 429, headers: { "Retry-After": limit.retryAfterSeconds.toString() } }
        );
      }

      const { code, newPassword } = body;
      if (!code || !newPassword) {
        return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
      }

      const result = await resetPasswordWithCode(code, newPassword);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

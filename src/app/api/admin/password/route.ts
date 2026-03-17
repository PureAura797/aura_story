import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { changePassword, createRecoveryCode, resetPasswordWithCode } from "@/lib/admin-password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // ─── Change password (requires auth) ───
    if (action === "change") {
      if (!isAdminAuthenticatedFromRequest(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { currentPassword, newPassword } = body;
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
      }

      const result = changePassword(currentPassword, newPassword);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    // ─── Request recovery code (no auth needed) ───
    if (action === "request_recovery") {
      const { email } = body;
      if (!email || !email.includes("@")) {
        return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
      }

      const result = await createRecoveryCode(email);
      // Always return success (don't reveal if email exists)
      return NextResponse.json({
        success: true,
        emailSent: result.emailSent,
        message: result.emailSent
          ? "Код отправлен на почту"
          : "Код создан (проверьте консоль сервера — SMTP не настроен)",
      });
    }

    // ─── Reset password with code (no auth needed) ───
    if (action === "reset") {
      const { code, newPassword } = body;
      if (!code || !newPassword) {
        return NextResponse.json({ error: "Заполните все поля" }, { status: 400 });
      }

      const result = resetPasswordWithCode(code, newPassword);
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

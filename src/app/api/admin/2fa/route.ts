import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/admin-password";
import { is2FAEnabled, setup2FA, enable2FA, disable2FA } from "@/lib/admin-totp";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enabled = await is2FAEnabled();
  return NextResponse.json({ enabled });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, code, password } = await request.json();

    switch (action) {
      case "setup": {
        const result = await setup2FA();
        return NextResponse.json(result);
      }

      case "enable": {
        if (!code) {
          return NextResponse.json({ error: "Введите код" }, { status: 400 });
        }
        const ok = await enable2FA(code);
        if (!ok) {
          return NextResponse.json({ error: "Неверный код. Попробуйте ещё раз." }, { status: 400 });
        }
        return NextResponse.json({ success: true });
      }

      case "disable": {
        if (!password || !(await verifyPassword(password))) {
          return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
        }
        await disable2FA();
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

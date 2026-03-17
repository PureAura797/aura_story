import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie, clearAdminCookie } from "@/lib/admin-auth";
import { verifyPassword } from "@/lib/admin-password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, action } = body;

    if (action === "logout") {
      await clearAdminCookie();
      return NextResponse.json({ success: true });
    }

    if (!password || !verifyPassword(password)) {
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    await setAdminCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

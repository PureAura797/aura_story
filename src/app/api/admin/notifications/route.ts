import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { readData, writeData } from "@/lib/supabase";

const DEFAULTS = {
  email: { enabled: false, recipients: "", smtp: { host: "", port: 587, user: "", pass: "" } },
  telegram: { enabled: false, botToken: "", chatIds: "" },
  max: { enabled: false, botToken: "", chatIds: "" },
  webhook: { enabled: false, url: "" },
};

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const saved = await readData<typeof DEFAULTS>("notifications", DEFAULTS);
  return NextResponse.json({ ...DEFAULTS, ...saved });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    await writeData("notifications", data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

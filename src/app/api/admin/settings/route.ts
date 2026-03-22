import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { readData, writeData } from "@/lib/supabase";

const DEFAULTS = {
  recoveryEmail: "",
  adminPhone: "",
  certificateDownloadEnabled: true,
  certificateMaskLicense: false,
};

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const saved = await readData<typeof DEFAULTS>("settings", DEFAULTS);
  return NextResponse.json({ ...DEFAULTS, ...saved });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const current = await readData<typeof DEFAULTS>("settings", DEFAULTS);
    const updated = {
      ...current,
      recoveryEmail: body.recoveryEmail ?? current.recoveryEmail,
      adminPhone: body.adminPhone ?? current.adminPhone,
      certificateDownloadEnabled: body.certificateDownloadEnabled ?? current.certificateDownloadEnabled,
      certificateMaskLicense: body.certificateMaskLicense ?? current.certificateMaskLicense,
    };
    await writeData("settings", updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";

const DATA_FILE = path.join(process.cwd(), "src", "data", "admin_settings.json");

function readSettings() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch { /* ignore */ }
  return { recoveryEmail: "", adminPhone: "" };
}

function writeSettings(data: Record<string, string>) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(readSettings());
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const current = readSettings();
    const updated = {
      ...current,
      recoveryEmail: body.recoveryEmail ?? current.recoveryEmail,
      adminPhone: body.adminPhone ?? current.adminPhone,
    };
    writeSettings(updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/analytics.json");

const DEFAULTS = {
  yandexMetrika: "",
  googleAnalytics: "",
  googleTagManager: "",
  vkPixel: "",
  customScripts: [] as { id: string; name: string; position: "head" | "body"; code: string; enabled: boolean }[],
};

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function GET(request: NextRequest) {
  // Allow public access for script injection
  const isPublic = request.nextUrl.searchParams.get("public") === "true";

  if (!isPublic && !isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      return NextResponse.json({ ...DEFAULTS, ...data });
    }
  } catch {}
  return NextResponse.json(DEFAULTS);
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

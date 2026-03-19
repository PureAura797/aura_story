import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { readData, writeData } from "@/lib/supabase";

const DEFAULTS = {
  yandexMetrika: "",
  googleAnalytics: "",
  googleTagManager: "",
  vkPixel: "",
  customScripts: [] as { id: string; name: string; position: "head" | "body"; code: string; enabled: boolean }[],
};

export async function GET(request: NextRequest) {
  const isPublic = request.nextUrl.searchParams.get("public") === "true";

  if (!isPublic && !(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const saved = await readData<typeof DEFAULTS>("analytics", DEFAULTS);
  return NextResponse.json({ ...DEFAULTS, ...saved });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    await writeData("analytics", data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

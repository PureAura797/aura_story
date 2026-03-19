import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getSeo, saveSeo, SeoSettings } from "@/lib/data";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getSeo());
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as SeoSettings;
  await saveSeo(body);
  return NextResponse.json({ ok: true });
}

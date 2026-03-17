import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getCalculatorConfig, saveCalculatorConfig } from "@/lib/data";
import type { CalculatorConfig } from "@/lib/data";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = getCalculatorConfig();
  return NextResponse.json(config);
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const config = (await request.json()) as CalculatorConfig;
    saveCalculatorConfig(config);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/data";
import ru from "@/lib/i18n/ru";
import en from "@/lib/i18n/en";
import { getCalculatorConfig } from "@/lib/data";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") || "ru";
  const type = request.nextUrl.searchParams.get("type") || "content";

  if (type === "calculator") {
    const config = getCalculatorConfig();
    return NextResponse.json(config, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  }

  const defaults = locale === "en" ? en : ru;
  const overrides = getContent(locale as "ru" | "en");
  const merged = { ...defaults, ...overrides };

  return NextResponse.json(merged, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
  });
}

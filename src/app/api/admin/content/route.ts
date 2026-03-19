import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getContent, saveContent } from "@/lib/data";
import ru from "@/lib/i18n/ru";
import en from "@/lib/i18n/en";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const locale = request.nextUrl.searchParams.get("locale") || "ru";
  const defaults = locale === "en" ? en : ru;
  const overrides = await getContent(locale as "ru" | "en");

  // Merge defaults with overrides
  const merged = { ...defaults, ...overrides };

  return NextResponse.json({ content: merged, locale });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { locale, content } = body as { locale: "ru" | "en"; content: Record<string, string> };

    if (!locale || !content) {
      return NextResponse.json({ error: "Missing locale or content" }, { status: 400 });
    }

    // Only save keys that differ from defaults
    const defaults = locale === "en" ? en : ru;
    const overrides: Record<string, string> = {};
    for (const [key, value] of Object.entries(content)) {
      if (defaults[key] !== value) {
        overrides[key] = value;
      }
    }

    await saveContent(locale, overrides);
    return NextResponse.json({ success: true, overrideCount: Object.keys(overrides).length });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

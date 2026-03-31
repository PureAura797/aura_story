import { NextResponse } from "next/server";
import { readData } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DEFAULTS = {
  yandexMetrika: "",
  googleAnalytics: "",
  googleTagManager: "",
  vkPixel: "",
  customScripts: [] as { id: string; name: string; position: "head" | "body"; code: string; enabled: boolean }[],
};

export async function GET() {
  try {
    const saved = await readData<typeof DEFAULTS>("analytics", DEFAULTS);
    return NextResponse.json({ ...DEFAULTS, ...saved });
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

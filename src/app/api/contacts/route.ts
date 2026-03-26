import { NextResponse } from "next/server";
import { readData } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const DEFAULTS = {
  phone: "+74999640042",
  phoneDisplay: "8 (499) 964-00-42",
  phoneMobile: "+79916343620",
  phoneMobileDisplay: "8 (991) 634-36-20",
  email: "help@auraremediation.com",
  telegram: "https://t.me/pureaura",
  max: "https://max.ru/pureaura",
  webhookUrl: "",
  address: "Москва, Россия",
  workHours: "Круглосуточно, 24/7",
};

export async function GET() {
  try {
    const saved = await readData<Partial<typeof DEFAULTS>>("contacts", {});
    const contacts = { ...DEFAULTS, ...saved };
    return NextResponse.json(contacts, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

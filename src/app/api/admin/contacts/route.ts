import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { readData, writeData } from "@/lib/supabase";

export interface ContactsConfig {
  phone: string;
  phoneDisplay: string;
  phoneMobile: string;
  phoneMobileDisplay: string;
  email: string;
  telegram: string;
  max: string;
  webhookUrl: string;
  address: string;
  workHours: string;
}

const DEFAULTS: ContactsConfig = {
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

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const saved = await readData<Partial<ContactsConfig>>("contacts", {});
  return NextResponse.json({ ...DEFAULTS, ...saved });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await request.json();
    await writeData("contacts", data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

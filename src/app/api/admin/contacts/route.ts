import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");

export interface ContactsConfig {
  phone: string;
  phoneDisplay: string;
  email: string;
  telegram: string;
  max: string;
  webhookUrl: string;
  address: string;
  workHours: string;
}

const DEFAULTS: ContactsConfig = {
  phone: "+74951203456",
  phoneDisplay: "8 495 120-34-56",
  email: "help@auraremediation.com",
  telegram: "https://t.me/pureaura",
  max: "https://max.ru/pureaura",
  webhookUrl: "",
  address: "Москва, Россия",
  workHours: "Круглосуточно, 24/7",
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getContacts(): ContactsConfig {
  try {
    if (fs.existsSync(CONTACTS_FILE)) {
      const saved = JSON.parse(fs.readFileSync(CONTACTS_FILE, "utf-8"));
      return { ...DEFAULTS, ...saved };
    }
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getContacts());
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    ensureDataDir();

    // Only save non-default values
    const toSave: Partial<ContactsConfig> = {};
    for (const [key, value] of Object.entries(body)) {
      if (value !== DEFAULTS[key as keyof ContactsConfig]) {
        toSave[key as keyof ContactsConfig] = value as string;
      }
    }

    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(toSave, null, 2));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}

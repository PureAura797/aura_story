import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");

const DEFAULTS = {
  phone: "+74951203456",
  phoneDisplay: "8 495 120-34-56",
  email: "help@auraremediation.com",
  telegram: "https://t.me/pureaura",
  max: "https://max.ru/pureaura",
  webhookUrl: "",
  address: "Москва, Россия",
  workHours: "Круглосуточно, 24/7",
};

export async function GET() {
  try {
    let contacts = { ...DEFAULTS };
    if (fs.existsSync(CONTACTS_FILE)) {
      const saved = JSON.parse(fs.readFileSync(CONTACTS_FILE, "utf-8"));
      contacts = { ...DEFAULTS, ...saved };
    }
    return NextResponse.json(contacts, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch {
    return NextResponse.json(DEFAULTS);
  }
}

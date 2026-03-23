import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "src/data/analytics.json");

export async function GET() {
  const defaults = {
    yandexMetrika: "",
    googleAnalytics: "",
    googleTagManager: "",
    vkPixel: "",
    customScripts: [],
  };
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = { ...defaults, ...JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) };
      return NextResponse.json(data, {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
      });
    }
  } catch {}
  return NextResponse.json(defaults, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}

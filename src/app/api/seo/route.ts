import { NextResponse } from "next/server";
import { getSeo } from "@/lib/data";

export async function GET() {
  const data = await getSeo();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}

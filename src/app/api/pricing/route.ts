import { NextResponse } from "next/server";
import { getPricing } from "@/lib/data";

export async function GET() {
  const pricing = await getPricing();
  const published = pricing
    .filter((p) => p.published)
    .sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json(published);
}

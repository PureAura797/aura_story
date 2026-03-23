import { NextResponse } from "next/server";
import { getPortfolio } from "@/lib/data";

export async function GET() {
  const items = await getPortfolio();
  const published = items
    .filter((p) => p.published)
    .sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json(published);
}

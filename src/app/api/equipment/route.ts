import { NextResponse } from "next/server";
import { getEquipment } from "@/lib/data";

export async function GET() {
  const items = await getEquipment();
  const published = items
    .filter((e) => e.published)
    .sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json(published);
}

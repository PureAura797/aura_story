import { NextResponse } from "next/server";
import { getServices } from "@/lib/data";

export async function GET() {
  const services = await getServices();
  const published = services
    .filter((s) => s.published)
    .sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json(published);
}

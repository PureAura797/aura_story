import { NextResponse } from "next/server";
import { getStories } from "@/lib/data";

export async function GET() {
  const items = await getStories();
  const published = items
    .filter((s) => s.published)
    .sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json(published);
}

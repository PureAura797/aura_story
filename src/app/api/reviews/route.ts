import { NextResponse } from "next/server";
import { getReviews } from "@/lib/data";

export async function GET() {
  const reviews = await getReviews();
  const published = reviews
    .filter((r) => r.published)
    .sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json(published);
}

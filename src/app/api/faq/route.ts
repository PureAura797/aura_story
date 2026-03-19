import { NextResponse } from "next/server";
import { getFaq } from "@/lib/data";

export async function GET() {
  const faq = await getFaq();
  const published = faq
    .filter((f) => f.published)
    .sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json(published);
}

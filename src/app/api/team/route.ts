import { NextResponse } from "next/server";
import { getTeam } from "@/lib/data";

export async function GET() {
  const items = await getTeam();
  return NextResponse.json(
    items
      .filter((i) => i.published)
      .sort((a, b) => a.sort_order - b.sort_order)
  );
}

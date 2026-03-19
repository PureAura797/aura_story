import { NextResponse } from "next/server";
import { getSeo } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getSeo());
}

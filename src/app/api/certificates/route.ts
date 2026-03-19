import { NextResponse } from "next/server";
import { getCertificates } from "@/lib/data";

export async function GET() {
  const certs = await getCertificates();
  const published = certs
    .filter((c) => c.published)
    .sort((a, b) => a.sort_order - b.sort_order);
  return NextResponse.json(published);
}

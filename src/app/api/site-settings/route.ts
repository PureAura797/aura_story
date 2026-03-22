import { NextResponse } from "next/server";
import { readData } from "@/lib/supabase";

const DEFAULTS = {
  certificateDownloadEnabled: true,
  certificateMaskLicense: false,
};

// Public endpoint — no auth required, returns only non-sensitive site settings
export async function GET() {
  const settings = await readData<typeof DEFAULTS>("settings", DEFAULTS);
  return NextResponse.json({
    certificateMaskLicense: settings.certificateMaskLicense ?? false,
  });
}

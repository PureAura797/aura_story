import { NextResponse } from "next/server";
import { getCertificates } from "@/lib/data";
import { readData } from "@/lib/supabase";

const SETTINGS_DEFAULTS = {
  certificateDownloadEnabled: true,
  certificateMaskLicense: false,
};

function maskLicenseNumber(num: string): string {
  if (!num || num.length <= 4) return num;
  return "•••" + num.slice(-4);
}

export async function GET() {
  const [certs, settings] = await Promise.all([
    getCertificates(),
    readData<typeof SETTINGS_DEFAULTS>("settings", SETTINGS_DEFAULTS),
  ]);

  const published = certs
    .filter((c) => c.published)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((c) => ({
      ...c,
      number: settings.certificateMaskLicense ? maskLicenseNumber(c.number) : c.number,
      download_url: settings.certificateDownloadEnabled ? c.download_url : "",
    }));

  return NextResponse.json(published);
}

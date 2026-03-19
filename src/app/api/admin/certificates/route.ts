import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getCertificates, saveCertificates } from "@/lib/data";
import type { CertificateItem } from "@/lib/data";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const certs = await getCertificates();
  return NextResponse.json(certs);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { action, item, items } = body as {
      action: "save_all" | "add" | "delete";
      item?: CertificateItem;
      items?: CertificateItem[];
    };

    if (action === "save_all" && items) {
      await saveCertificates(items);
      return NextResponse.json({ success: true });
    }

    const current = await getCertificates();

    if (action === "add" && item) {
      item.id = item.id || Date.now().toString();
      current.push(item);
      await saveCertificates(current);
      return NextResponse.json({ success: true, id: item.id });
    }

    if (action === "delete" && item?.id) {
      const filtered = current.filter((c) => c.id !== item.id);
      await saveCertificates(filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

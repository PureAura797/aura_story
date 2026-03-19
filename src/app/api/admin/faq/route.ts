import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getFaq, saveFaq } from "@/lib/data";
import type { FaqItem } from "@/lib/data";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const faq = await getFaq();
  return NextResponse.json(faq);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { action, item, items } = body as {
      action: "save_all" | "add" | "delete";
      item?: FaqItem;
      items?: FaqItem[];
    };

    if (action === "save_all" && items) {
      await saveFaq(items);
      return NextResponse.json({ success: true });
    }

    const current = await getFaq();

    if (action === "add" && item) {
      item.id = item.id || Date.now().toString();
      current.push(item);
      await saveFaq(current);
      return NextResponse.json({ success: true, id: item.id });
    }

    if (action === "delete" && item?.id) {
      const filtered = current.filter((f) => f.id !== item.id);
      await saveFaq(filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

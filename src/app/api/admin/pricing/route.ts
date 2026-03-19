import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getPricing, savePricing } from "@/lib/data";
import type { PricingItem } from "@/lib/data";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pricing = await getPricing();
  return NextResponse.json(pricing);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { action, item, items } = body as {
      action: "save_all" | "add" | "delete";
      item?: PricingItem;
      items?: PricingItem[];
    };

    if (action === "save_all" && items) {
      await savePricing(items);
      return NextResponse.json({ success: true });
    }

    const current = await getPricing();

    if (action === "add" && item) {
      item.id = item.id || Date.now().toString();
      current.push(item);
      await savePricing(current);
      return NextResponse.json({ success: true, id: item.id });
    }

    if (action === "delete" && item?.id) {
      const filtered = current.filter((p) => p.id !== item.id);
      await savePricing(filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

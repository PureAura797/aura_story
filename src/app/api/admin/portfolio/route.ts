import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getPortfolio, savePortfolio } from "@/lib/data";
import type { PortfolioItem } from "@/lib/data";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await getPortfolio();
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { action, item, items } = body as {
      action: "save_all" | "add" | "delete";
      item?: PortfolioItem;
      items?: PortfolioItem[];
    };

    if (action === "save_all" && items) {
      await savePortfolio(items);
      return NextResponse.json({ success: true });
    }

    const current = await getPortfolio();

    if (action === "add" && item) {
      item.id = item.id || Date.now().toString();
      current.push(item);
      await savePortfolio(current);
      return NextResponse.json({ success: true, id: item.id });
    }

    if (action === "delete" && item?.id) {
      const filtered = current.filter((p) => p.id !== item.id);
      await savePortfolio(filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

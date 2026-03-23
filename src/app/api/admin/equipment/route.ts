import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getEquipment, saveEquipment } from "@/lib/data";
import type { EquipmentItem } from "@/lib/data";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await getEquipment();
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
      item?: EquipmentItem;
      items?: EquipmentItem[];
    };

    if (action === "save_all" && items) {
      await saveEquipment(items);
      return NextResponse.json({ success: true });
    }

    const current = await getEquipment();

    if (action === "add" && item) {
      item.id = item.id || Date.now().toString();
      current.push(item);
      await saveEquipment(current);
      return NextResponse.json({ success: true, id: item.id });
    }

    if (action === "delete" && item?.id) {
      const filtered = current.filter((e) => e.id !== item.id);
      await saveEquipment(filtered);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

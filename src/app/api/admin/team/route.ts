import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import { getTeam, saveTeam, TeamMember } from "@/lib/data";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getTeam());
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { action } = body;

  if (action === "save_all") {
    await saveTeam(body.items as TeamMember[]);
    return NextResponse.json({ ok: true });
  }
  if (action === "add") {
    const items = await getTeam();
    const newItem: TeamMember = {
      id: Date.now().toString(),
      name: "Новый сотрудник",
      role: "Должность",
      status: "Доступен",
      experience: "1 год",
      objects: "0",
      specialization: "Специализация",
      avatar: "",
      color: "#5eead4",
      published: false,
      sort_order: items.length,
    };
    items.push(newItem);
    await saveTeam(items);
    return NextResponse.json(items);
  }
  if (action === "delete") {
    let items = await getTeam();
    items = items.filter((i) => i.id !== body.id);
    await saveTeam(items);
    return NextResponse.json(items);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

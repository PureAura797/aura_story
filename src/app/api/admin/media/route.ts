import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import {
  uploadFile,
  deleteFile,
  listFiles,
  isAllowedExtension,
  MAX_FILE_SIZE,
  ALLOWED_EXTENSIONS,
} from "@/lib/supabase-storage";

// Media categories — folders in Supabase Storage bucket
const MEDIA_CATEGORIES: Record<string, { dir: string; category: string }> = {
  stories_covers: { dir: "stories/covers", category: "stories_covers" },
  stories_videos: { dir: "stories/videos", category: "stories_videos" },
  portfolio: { dir: "images/portfolio", category: "portfolio" },
  equipment: { dir: "equipment", category: "equipment" },
};

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result: Record<
    string,
    { dir: string; files: { name: string; exists: boolean; size: number; url: string }[] }
  > = {};

  for (const [key, config] of Object.entries(MEDIA_CATEGORIES)) {
    const files = await listFiles(config.dir);
    // Filter by allowed extensions for this category
    const allowedExts = ALLOWED_EXTENSIONS[config.category] ?? [];
    const filtered = files.filter((f) => {
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      return allowedExts.includes(ext);
    });
    result[key] = {
      dir: config.dir,
      files: filtered.map((f) => ({ ...f, exists: true })),
    };
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetPath = formData.get("path") as string | null;
    const category = formData.get("category") as string | null;

    if (!file || !targetPath)
      return NextResponse.json({ error: "Файл и путь обязательны" }, { status: 400 });

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      const maxMB = Math.round(MAX_FILE_SIZE / (1024 * 1024));
      return NextResponse.json(
        { error: `Файл слишком большой. Максимум ${maxMB}MB` },
        { status: 400 }
      );
    }

    // Format validation
    const cat = category || detectCategory(targetPath);
    if (!isAllowedExtension(file.name, cat)) {
      const allowed = ALLOWED_EXTENSIONS[cat]?.join(", ") ?? "?";
      return NextResponse.json(
        { error: `Неверный формат. Допустимые: ${allowed}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(targetPath, buffer, file.type || "application/octet-stream");

    if ("error" in result)
      return NextResponse.json({ error: result.error }, { status: 500 });

    return NextResponse.json({ success: true, url: result.url, size: buffer.length });
  } catch (e) {
    return NextResponse.json({ error: `Ошибка загрузки: ${e}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { path: targetPath } = await request.json();
    if (!targetPath)
      return NextResponse.json({ error: "Путь обязателен" }, { status: 400 });

    const result = await deleteFile(targetPath);
    if (result.error)
      return NextResponse.json({ error: result.error }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `Ошибка удаления: ${e}` }, { status: 500 });
  }
}

/** Detect category from path (e.g. "stories/covers/foo.png" → "stories_covers") */
function detectCategory(filePath: string): string {
  for (const [key, config] of Object.entries(MEDIA_CATEGORIES)) {
    if (filePath.startsWith(config.dir)) return config.category;
  }
  // Fallback for team/certificates
  if (filePath.startsWith("team/")) return "team";
  if (filePath.startsWith("certificates/")) return "certificates";
  return "portfolio";
}

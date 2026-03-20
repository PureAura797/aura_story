import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import {
  uploadFile,
  deleteFile,
  listFiles,
  isAllowedExtension,
  isAllowedMime,
  MAX_FILE_SIZE,
  ALLOWED_EXTENSIONS,
} from "@/lib/supabase-storage";
import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Media categories — folders matching actual public/ structure
const MEDIA_CATEGORIES: Record<string, { dir: string; category: string }> = {
  stories_covers: { dir: "stories/covers", category: "stories_covers" },
  stories_videos: { dir: "stories", category: "stories_videos" },
  portfolio: { dir: "images/portfolio", category: "portfolio" },
  equipment: { dir: "equipment", category: "equipment" },
};

// Scan local public/ directory for legacy files
function scanLocalDir(dirPath: string, extensions: string[]): { name: string; size: number; url: string }[] {
  const fullDir = path.join(PUBLIC_DIR, dirPath);
  try {
    if (!fs.existsSync(fullDir)) return [];
    return fs.readdirSync(fullDir)
      .filter((f) => extensions.includes(path.extname(f).toLowerCase()))
      .sort()
      .map((name) => {
        const stats = fs.statSync(path.join(fullDir, name));
        return { name, size: stats.size, url: `/${dirPath}/${name}` };
      });
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result: Record<
    string,
    { dir: string; files: { name: string; exists: boolean; size: number; url: string }[] }
  > = {};

  for (const [key, config] of Object.entries(MEDIA_CATEGORIES)) {
    const allowedExts = ALLOWED_EXTENSIONS[config.category] ?? [];

    // Get files from Supabase Storage
    const supabaseFiles = await listFiles(config.dir);
    const supaFiltered = supabaseFiles.filter((f) => {
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      return allowedExts.includes(ext);
    });

    // Get files from local public/ (legacy)
    const localFiles = scanLocalDir(config.dir, allowedExts);

    // Merge: Supabase files take priority, add local files not in Supabase
    const supaNames = new Set(supaFiltered.map((f) => f.name));
    const merged = [
      ...supaFiltered,
      ...localFiles.filter((f) => !supaNames.has(f.name)),
    ].sort((a, b) => a.name.localeCompare(b.name));

    result[key] = {
      dir: config.dir,
      files: merged.map((f) => ({ ...f, exists: true })),
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

    // ── Path traversal protection ──
    const ALLOWED_PREFIXES = ["stories/", "images/", "equipment/", "team/", "certificates/"];
    const cleanPath = targetPath
      .replace(/\.\./g, "")           // block ../
      .replace(/\/\//g, "/")          // normalize //
      .replace(/\0/g, "")            // block null bytes
      .replace(/^\/+/, "");           // strip leading /
    
    if (!ALLOWED_PREFIXES.some((p) => cleanPath.startsWith(p))) {
      return NextResponse.json(
        { error: "Недопустимый путь загрузки" },
        { status: 400 }
      );
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      const maxMB = Math.round(MAX_FILE_SIZE / (1024 * 1024));
      return NextResponse.json(
        { error: `Файл слишком большой. Максимум ${maxMB}MB` },
        { status: 400 }
      );
    }

    // Format validation (extension + MIME)
    const cat = category || detectCategory(cleanPath);
    if (!isAllowedExtension(file.name, cat)) {
      const allowed = ALLOWED_EXTENSIONS[cat]?.join(", ") ?? "?";
      return NextResponse.json(
        { error: `Неверный формат. Допустимые: ${allowed}` },
        { status: 400 }
      );
    }
    if (!isAllowedMime(file.type || "")) {
      return NextResponse.json(
        { error: `Недопустимый тип файла: ${file.type}` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(cleanPath, buffer, file.type || "application/octet-stream");

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

    // Try delete from both Supabase and local
    const result = await deleteFile(targetPath);

    // Also try to delete from local filesystem
    const localPath = path.resolve(PUBLIC_DIR, targetPath);
    if (localPath.startsWith(PUBLIC_DIR) && fs.existsSync(localPath)) {
      try { fs.unlinkSync(localPath); } catch { /* ignore */ }
    }

    if (result.error)
      return NextResponse.json({ error: result.error }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `Ошибка удаления: ${e}` }, { status: 500 });
  }
}

/** Detect category from path */
function detectCategory(filePath: string): string {
  for (const [, config] of Object.entries(MEDIA_CATEGORIES)) {
    if (filePath.startsWith(config.dir)) return config.category;
  }
  if (filePath.startsWith("team/")) return "team";
  if (filePath.startsWith("certificates/")) return "certificates";
  return "portfolio";
}

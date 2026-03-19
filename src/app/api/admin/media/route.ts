import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Media categories — directories are scanned dynamically
const MEDIA_CATEGORIES: Record<string, { dir: string; extensions: string[] }> = {
  stories_covers: { dir: "stories/covers", extensions: [".png", ".jpg", ".jpeg", ".webp"] },
  stories_videos: { dir: "stories", extensions: [".mp4", ".webm", ".mov"] },
  portfolio: { dir: "images/portfolio", extensions: [".png", ".jpg", ".jpeg", ".webp"] },
  equipment: { dir: "equipment", extensions: [".png", ".jpg", ".jpeg", ".webp"] },
};

function scanDir(dirPath: string, extensions: string[]): { name: string; exists: boolean; size: number; url: string }[] {
  const fullDir = path.join(PUBLIC_DIR, dirPath);
  try {
    if (!fs.existsSync(fullDir)) return [];
    return fs.readdirSync(fullDir)
      .filter((f) => extensions.includes(path.extname(f).toLowerCase()))
      .sort()
      .map((name) => {
        const filePath = path.join(fullDir, name);
        const stats = fs.statSync(filePath);
        return { name, exists: true, size: stats.size, url: `/${dirPath}/${name}` };
      });
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result: Record<string, { dir: string; files: { name: string; exists: boolean; size: number; url: string }[] }> = {};

  for (const [category, config] of Object.entries(MEDIA_CATEGORIES)) {
    result[category] = { dir: config.dir, files: scanDir(config.dir, config.extensions) };
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

    if (!file || !targetPath)
      return NextResponse.json({ error: "File and path are required" }, { status: 400 });

    const resolvedPath = path.resolve(PUBLIC_DIR, targetPath);
    if (!resolvedPath.startsWith(PUBLIC_DIR))
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });

    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(resolvedPath, buffer);

    return NextResponse.json({ success: true, path: targetPath, size: buffer.length });
  } catch (e) {
    return NextResponse.json({ error: `Upload failed: ${e}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticatedFromRequest(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { path: targetPath } = await request.json();
    if (!targetPath)
      return NextResponse.json({ error: "Path is required" }, { status: 400 });

    const resolvedPath = path.resolve(PUBLIC_DIR, targetPath);
    if (!resolvedPath.startsWith(PUBLIC_DIR))
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });

    if (fs.existsSync(resolvedPath)) {
      fs.unlinkSync(resolvedPath);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `Delete failed: ${e}` }, { status: 500 });
  }
}

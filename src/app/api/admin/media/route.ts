import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromRequest } from "@/lib/admin-auth";
import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// Map of media categories to their directory structure
const MEDIA_SLOTS: Record<string, { dir: string; files: string[] }> = {
  team: {
    dir: "team",
    files: ["alexey.png", "marina.png", "dmitry.png", "elena.png", "igor.png", "anna.png"],
  },
  stories_covers: {
    dir: "stories/covers",
    files: ["cover-1.png", "cover-2.png", "cover-3.png", "cover-4.png", "cover-5.png", "cover-6.png"],
  },
  stories_videos: {
    dir: "stories",
    files: [
      "story-1_1.mp4", "story-1_2.mp4", "story-1_3.mp4", "story-1_4.mp4",
      "story-2_1.mp4", "story-2_2.mp4", "story-2_3.mp4", "story-2_4.mp4",
      "story-3_1.mp4", "story-3_2.mp4", "story-3_3.mp4", "story-3_4.mp4",
      "story-4_1.mp4", "story-4_2.mp4", "story-4_3.mp4", "story-4_4.mp4",
      "story-5_1.mp4", "story-5_2.mp4", "story-5_3.mp4", "story-5_4.mp4",
      "story-6_1.mp4", "story-6_2.mp4", "story-6_3.mp4", "story-6_4.mp4",
    ],
  },
  portfolio: {
    dir: "images/portfolio",
    files: ["hoarder_before.png", "hoarder_after.png", "fire_before.png", "fire_after.png"],
  },
  equipment: {
    dir: "equipment",
    files: ["ozone.png", "hydroxyl.png", "fogger.png", "atp.png", "dehumidifier.png", "ppe.png"],
  },
};

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Return all media slots with their existence status and sizes
  const result: Record<string, { dir: string; files: { name: string; exists: boolean; size: number; url: string }[] }> = {};

  for (const [category, config] of Object.entries(MEDIA_SLOTS)) {
    const files = config.files.map((filename) => {
      const filePath = path.join(PUBLIC_DIR, config.dir, filename);
      let exists = false;
      let size = 0;
      try {
        exists = fs.existsSync(filePath);
        if (exists) {
          const stats = fs.statSync(filePath);
          size = stats.size;
        }
      } catch { /* read-only FS (Vercel) — treat as missing */ }
      return {
        name: filename,
        exists,
        size,
        url: `/${config.dir}/${filename}`,
      };
    });
    result[category] = { dir: config.dir, files };
  }

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetPath = formData.get("path") as string | null;

    if (!file || !targetPath) {
      return NextResponse.json({ error: "File and path are required" }, { status: 400 });
    }

    // Security: Ensure the path is within public/
    const resolvedPath = path.resolve(PUBLIC_DIR, targetPath);
    if (!resolvedPath.startsWith(PUBLIC_DIR)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    // Ensure directory exists
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(resolvedPath, buffer);

    return NextResponse.json({
      success: true,
      path: targetPath,
      size: buffer.length,
    });
  } catch (e) {
    return NextResponse.json({ error: `Upload failed: ${e}` }, { status: 500 });
  }
}

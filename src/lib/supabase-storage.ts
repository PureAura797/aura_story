import { supabaseAdmin } from "./supabase";

const BUCKET = "media";

/** Upload a file to Supabase Storage */
export async function uploadFile(
  filePath: string,
  buffer: Buffer,
  contentType: string
): Promise<{ url: string } | { error: string }> {
  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filePath, buffer, {
      contentType,
      upsert: true,
    });

  if (error) return { error: error.message };

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);
  return { url: data.publicUrl };
}

/** Delete a file from Supabase Storage */
export async function deleteFile(filePath: string): Promise<{ error?: string }> {
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([filePath]);
  if (error) return { error: error.message };
  return {};
}

/** List files in a folder */
export async function listFiles(
  folder: string
): Promise<{ name: string; size: number; url: string }[]> {
  const { data, error } = await supabaseAdmin.storage.from(BUCKET).list(folder, {
    sortBy: { column: "name", order: "asc" },
  });

  if (error || !data) return [];

  return data
    .filter((f) => f.name && !f.name.startsWith("."))
    .map((f) => {
      const fullPath = `${folder}/${f.name}`;
      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET)
        .getPublicUrl(fullPath);
      return {
        name: f.name,
        size: f.metadata?.size ?? 0,
        url: urlData.publicUrl,
      };
    });
}

/** Get public URL for a file */
export function getPublicUrl(filePath: string): string {
  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

/** Allowed extensions per category */
export const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  stories_covers: [".png", ".jpg", ".jpeg", ".webp"],
  stories_videos: [".mp4", ".webm", ".mov"],
  portfolio: [".png", ".jpg", ".jpeg", ".webp"],
  equipment: [".png", ".jpg", ".jpeg", ".webp"],
  team: [".png", ".jpg", ".jpeg", ".webp"],
  certificates: [".png", ".jpg", ".jpeg", ".webp", ".pdf"],
  seo: [".ico", ".png", ".jpg", ".jpeg", ".webp", ".svg"],
};

/** Allowed MIME types — server-side validation */
const ALLOWED_MIMES: Record<string, boolean> = {
  "image/png": true,
  "image/jpeg": true,
  "image/webp": true,
  "image/x-icon": true,
  "image/vnd.microsoft.icon": true,
  "image/svg+xml": true,
  "video/mp4": true,
  "video/webm": true,
  "video/quicktime": true,
  "application/pdf": true,
};

/** Max file size: 10MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Validate file extension (prevents double extension: virus.exe.png) */
export function isAllowedExtension(filename: string, category: string): boolean {
  const parts = filename.split(".");
  // Block double extensions (e.g. virus.exe.png → 3+ parts)
  if (parts.length > 2) return false;
  const ext = "." + (parts.pop()?.toLowerCase() || "");
  const allowed = ALLOWED_EXTENSIONS[category] ?? ALLOWED_EXTENSIONS["portfolio"];
  return allowed.includes(ext);
}

/** Validate MIME type */
export function isAllowedMime(mimeType: string): boolean {
  return ALLOWED_MIMES[mimeType.toLowerCase()] === true;
}


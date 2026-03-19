import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side Supabase client with service_role key.
 * Use ONLY in API routes / server components — never expose to client.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

/* ─── Generic helpers ─── */

/** Read a JSON value from admin_data by key */
export async function readData<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await supabaseAdmin
      .from("admin_data")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}

/** Write a JSON value to admin_data (upsert) */
export async function writeData<T>(key: string, value: T): Promise<void> {
  try {
    await supabaseAdmin
      .from("admin_data")
      .upsert(
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
  } catch (e) {
    console.error(`[supabase] Failed to write key "${key}":`, e);
  }
}

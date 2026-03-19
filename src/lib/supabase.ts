import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** Lazy singleton — created on first use, not at import time */
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error("[supabase] Missing env vars:", { url: !!url, key: !!key });
      throw new Error("Supabase env vars not configured");
    }

    _client = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

/** Readonly accessor for other modules */
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as unknown as Record<string, unknown>)[prop as string];
  },
});

/* ─── Generic helpers ─── */

/** Read a JSON value from admin_data by key */
export async function readData<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await getClient()
      .from("admin_data")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) return fallback;
    return data.value as T;
  } catch (e) {
    console.error(`[supabase] readData("${key}") failed:`, e);
    return fallback;
  }
}

/** Write a JSON value to admin_data (upsert) */
export async function writeData<T>(key: string, value: T): Promise<void> {
  try {
    const { error } = await getClient()
      .from("admin_data")
      .upsert(
        { key, value: value as unknown, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    if (error) {
      console.error(`[supabase] writeData("${key}") error:`, error.message);
    }
  } catch (e) {
    console.error(`[supabase] writeData("${key}") failed:`, e);
  }
}

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// null when env vars not configured (dev without DB) — form falls back to mock success
export const supabaseBrowser = url && key
  ? createClient(url, key)
  : null;

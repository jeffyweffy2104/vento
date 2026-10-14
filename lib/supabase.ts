import { createClient } from "@supabase/supabase-js";
import { serverConfig } from "./config";

export function adminDatabase() {
  const config = serverConfig();
  return createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function publicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Public Supabase configuration is missing");
  return createClient(url, key);
}

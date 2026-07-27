import "server-only";

import { createClient } from "@supabase/supabase-js";

// The rental_* tables have RLS enabled with no policies, so the anon key can
// reach nothing. Every read and write goes through this service-role client,
// which bypasses RLS — that is why this module is server-only and the key is
// deliberately not exposed under a NEXT_PUBLIC_ name.
const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isDatabaseConfigured() {
  return Boolean(url && serviceRoleKey);
}

export function getSupabase() {
  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanimli degil. .env.local dosyasini kontrol edin."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

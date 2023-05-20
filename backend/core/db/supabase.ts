import { PostgrestError, createClient } from "@supabase/supabase-js";
import { initDotEnv } from "../../util/dotenv.ts";
import type { Database } from "../../types/schema.ts";
import { createApiErrorString } from "../../util/api.ts";

// MEMO: Initialize が Supabaseの初期化前に必ず実行されるようにする
await initDotEnv();

export const supabase = createClient<Database>(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

export const supabaseErrorResponse = (error: PostgrestError | null) => {
  if (!error) return null;
  return new Response(
    createApiErrorString({
      message: error.message,
      details: error.details,
      hint: error.hint,
      status: "DB_ERROR",
    }),
    { status: 200 }
  );
};

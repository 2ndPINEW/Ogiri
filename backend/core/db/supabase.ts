import { createClient } from "@supabase/supabase-js";
import { initDotEnv } from "../../util/dotenv.ts";

// MEMO: Initialize が Supabaseの初期化前に必ず実行されるようにする
await initDotEnv();

export const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

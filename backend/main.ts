/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import { initDotEnv } from "./util/dotenv.ts";
import { supabase } from "./core/db/supabase.ts";

await initDotEnv();

const { data, error } = await supabase.from("users").select("*");

console.log(data, error);

await start(manifest);

/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import { initDotEnv } from "./util/dotenv.ts";
await initDotEnv();

const port = Deno.env.get("PORT") || "8040";
await start(manifest, { port: Number(port) });

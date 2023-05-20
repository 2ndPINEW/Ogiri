import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../../core/db/supabase.ts";
import { generate } from "../../../../../core/ogiri/generator.ts";
import { createApiErrorString } from "../../../../../util/api.ts";
import {
  bodyPropertyCheck,
  isResponse,
  methodGuard,
} from "../../../../../util/guards.ts";
import { v1 } from "std/uuid";

const requestBodyProperties = [
  {
    key: "odai",
    type: "string",
  },
  {
    key: "limitS",
    type: "number",
  },
  {
    key: "apiKey",
    type: "string",
  },
] as const;

export const handler = async (req: Request, ctx: HandlerContext) => {
  const methodGuardResponse = methodGuard(req, ["POST"]);
  if (methodGuardResponse) return methodGuardResponse;

  const bodyProperty = await bodyPropertyCheck(req, requestBodyProperties);
  if (isResponse(bodyProperty)) return bodyProperty;
  const { odai, limitS, apiKey } = bodyProperty;
  const { groupId } = ctx.params;

  if (apiKey !== Deno.env.get("API_KEY")) {
    return new Response(
      createApiErrorString({
        message: "APIキーが不正です",
        status: "INVALID_API_KEY",
      }),
      { status: 200 }
    );
  }

  // グループが存在するかチェック
  const { data: groups } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId);
  if (groups?.length !== 1) {
    return new Response(
      createApiErrorString({
        message: "No group found",
        status: "NOT_FOUND",
      }),
      { status: 200 }
    );
  }

  // お題を生成
  const ogiriOdai = odai || (await generate());

  // 終了時間を計算
  const endTime = new Date(Date.now() + limitS * 1000);

  const data = {
    id: v1.generate().toString(),
    ended_at: endTime.toISOString(),
    group_id: groupId,
    odai: ogiriOdai,
  };
  // DBに保存
  const { error } = await supabase.from("ogiris").insert([data]);
  const supabaseError = supabaseErrorResponse(error);
  if (supabaseError) return supabaseError;

  return new Response(JSON.stringify(data));
};

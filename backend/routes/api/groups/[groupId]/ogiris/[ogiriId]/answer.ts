import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../../../core/db/supabase.ts";
import { createApiErrorString } from "../../../../../../util/api.ts";
import {
  bodyPropertyCheck,
  isResponse,
} from "../../../../../../util/guards.ts";
import { v1 } from "std/uuid";

const requestBodyProperties = [
  {
    key: "answer",
    type: "string",
  },
  {
    key: "userId",
    type: "string",
  },
] as const;

export const handler = async (req: Request, ctx: HandlerContext) => {
  const bodyProperty = await bodyPropertyCheck(req, requestBodyProperties);
  if (isResponse(bodyProperty)) return bodyProperty;
  const { answer, userId } = bodyProperty;
  const { groupId, ogiriId } = ctx.params;

  // 大喜利が存在するかチェック
  const { data: ogiris } = await supabase
    .from("ogiris")
    .select("*")
    .eq("id", ogiriId)
    .eq("group_id", groupId);
  const ogiri = ogiris?.[0];
  if (!ogiri) {
    return new Response(
      createApiErrorString({
        message: "Group not found",
        status: 404,
      }),
      { status: 404 }
    );
  }

  // TODO: 大喜利が終了していないかチェックする

  // ユーザーが存在するかチェック
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);
  if (users?.length !== 1) {
    return new Response(
      createApiErrorString({
        message: "User not found",
        status: 503,
      }),
      { status: 503 }
    );
  }

  const { error: insertAnswerError } = await supabase.from("answers").insert({
    id: v1.generate().toString(),
    answer: answer,
    ogiri_id: ogiriId,
    user_id: userId,
    status: "waiting",
  });
  const supabaseInsertAnswerError = supabaseErrorResponse(insertAnswerError);
  if (supabaseInsertAnswerError) return supabaseInsertAnswerError;

  return new Response(JSON.stringify(ctx.params));
};

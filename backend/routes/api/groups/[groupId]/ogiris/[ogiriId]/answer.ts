import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../../../core/db/supabase.ts";
import {
  SuccessString,
  createApiErrorString,
} from "../../../../../../util/api.ts";
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

  if (answer.length > 100) {
    return new Response(
      createApiErrorString({
        message: "回答が長すぎます。短くして下さい",
        status: "ANSWER_TO_LONG",
      }),
      { status: 400 }
    );
  }

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
        status: "NOT_FOUND",
      }),
      { status: 404 }
    );
  }

  // 大喜利が終了しているかチェック
  const isEnd = new Date(ogiri.ended_at) < new Date();
  if (isEnd) {
    return new Response(
      createApiErrorString({
        message: "この大喜利はすでに終了しています。",
        status: "ALREADY_ENDED",
      }),
      { status: 503 }
    );
  }

  // ユーザーが存在するかチェック
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);
  if (users?.length !== 1) {
    return new Response(
      createApiErrorString({
        message: "User not found",
        status: "USER_NOT_FOUND",
      }),
      { status: 503 }
    );
  }

  // TODO: 同じ回答がないかチェックする
  // TODO: ユーザーが回答済みかどうかチェックする？複数回答してもいい？

  const { error: insertAnswerError } = await supabase.from("answers").insert({
    id: v1.generate().toString(),
    answer: answer,
    ogiri_id: ogiriId,
    user_id: userId,
    status: "waiting",
    score: null,
    evaluation: null,
  });
  const supabaseInsertAnswerError = supabaseErrorResponse(insertAnswerError);
  if (supabaseInsertAnswerError) return supabaseInsertAnswerError;

  return new Response(SuccessString);
};

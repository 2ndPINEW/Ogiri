import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../../../core/db/supabase.ts";
import { scoring } from "../../../../../../core/ogiri/scoring.ts";
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

  // 大喜利が終了しているかチェック
  const isEnd = new Date(ogiri.ended_at) < new Date();
  if (isEnd) {
    return new Response(
      createApiErrorString({
        message: "This ogiri is already ended",
        status: 503,
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
        status: 503,
      }),
      { status: 503 }
    );
  }

  // TODO: 同じ回答がないかチェックする
  // TODO: ユーザーが回答済みかどうかチェックする？複数回答してもいい？

  // TODO: 採点はここでしないで、バッチ処理でするようにする
  const durationTime =
    new Date(ogiri.ended_at).getTime() - new Date(ogiri.created_at).getTime();
  const diffTime = new Date().getTime() - new Date(ogiri.created_at).getTime();
  const progress = diffTime / durationTime;

  let ogiriScore = 60;
  let ogiriReason = "感動でAIが採点できませんでした";
  try {
    const { score, reason } = await scoring(ogiri.odai, answer);
    ogiriScore = Number(score);
    ogiriReason = reason;
  } catch {}

  const maxProgressBonus = 10;
  ogiriScore += maxProgressBonus - progress * maxProgressBonus;

  const { error: insertAnswerError } = await supabase.from("answers").insert({
    id: v1.generate().toString(),
    answer: answer,
    ogiri_id: ogiriId,
    user_id: userId,
    status: "complete",
    score: ogiriScore,
    evaluation: ogiriReason,
  });
  const supabaseInsertAnswerError = supabaseErrorResponse(insertAnswerError);
  if (supabaseInsertAnswerError) return supabaseInsertAnswerError;

  return new Response(JSON.stringify(ctx.params));
};

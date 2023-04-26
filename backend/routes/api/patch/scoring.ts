import { HandlerContext } from "$fresh/server.ts";
import { supabase } from "../../../core/db/supabase.ts";
import { scoring } from "../../../core/ogiri/scoring.ts";
import { SuccessString } from "../../../util/api.ts";

export const handler = async (req: Request, ctx: HandlerContext) => {
  // 大喜利が存在するかチェック
  const { data: answers } = await supabase
    .from("answers")
    .select("*, ogiris(odai, created_at, ended_at)")
    .eq("status", "waiting");

  console.log(answers);
  if (!answers || answers.length === 0) {
    return new Response(SuccessString);
  }

  await Promise.all(
    answers.map(async (answer) => {
      const ogiri = Array.isArray(answer.ogiris)
        ? answer.ogiris[0]
        : answer.ogiris;
      if (!ogiri) {
        // TODO: status waitingでogiriがない場合はデータ変ちゃうか
        return;
      }
      const durationTime =
        new Date(ogiri.ended_at).getTime() -
        new Date(ogiri.created_at).getTime();
      const diffTime =
        new Date().getTime() - new Date(ogiri.created_at).getTime();
      const progress = diffTime / durationTime;

      let ogiriScore = 60;
      let ogiriReason = "感動でAIが採点できませんでした";
      try {
        const { score, reason } = await scoring(ogiri.odai, answer.answer);
        ogiriScore = Number(score);
        ogiriReason = reason;
      } catch {}

      const maxProgressBonus = 10;
      ogiriScore += maxProgressBonus - progress * maxProgressBonus;

      const { error: updateAnswerError } = await supabase
        .from("answers")
        .update({
          score: ogiriScore,
          evaluation: ogiriReason,
          status: "complete",
        })
        .eq("id", answer.id);
      if (updateAnswerError) return updateAnswerError;
    })
  );
  return new Response(SuccessString);
};

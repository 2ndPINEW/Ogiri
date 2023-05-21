import { HandlerContext } from "$fresh/server.ts";
import { supabase } from "../../../core/db/supabase.ts";
import { SuccessString } from "../../../util/api.ts";
import { sendSlack } from "../../../util/webhook.ts";

export const handler = async (_req: Request, _ctx: HandlerContext) => {
  const { data: ogiris } = await supabase
    .from("ogiris")
    .select("*")
    .eq("status", "open")
    .lte("ended_at", new Date().toISOString());

  if (!ogiris || ogiris.length === 0) {
    return new Response(SuccessString);
  }

  await Promise.all(
    ogiris.map(async (ogiri) => {
      const { data: answers } = await supabase
        .from("answers")
        .select("*, ogiris(odai, created_at, ended_at)")
        .not("status", "eq", "complete")
        .eq("ogiri_id", ogiri.id);

      if (!answers || answers.length === 0) {
        await supabase
          .from("ogiris")
          .update({ status: "complete" })
          .eq("id", ogiri.id);

        const { data: webhooks } = await supabase
          .from("webhooks")
          .select("*")
          .eq("group_id", ogiri.group_id);

        if (webhooks) {
          await Promise.all(
            webhooks.map((webhook) => {
              if (webhook.type === "slack") {
                return sendSlack({
                  message: `大喜利が終了しました！\nお題: ${ogiri.odai}\n<https://ogiri.obake.land/result/${ogiri.id}|結果を見る>`,
                  url: webhook.url,
                  username: "大喜利くん",
                });
              }
            })
          );
        }
        return;
      }
    })
  );
  return new Response(SuccessString);
};

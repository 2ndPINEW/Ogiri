import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../../../core/db/supabase.ts";
import { createApiErrorString } from "../../../../../../util/api.ts";
import { methodGuard } from "../../../../../../util/guards.ts";

export const handler = async (req: Request, ctx: HandlerContext) => {
  const methodGuardResponse = methodGuard(req, ["GET"]);
  if (methodGuardResponse) return methodGuardResponse;

  const { groupId, ogiriId } = ctx.params;

  const { data, error } = await supabase
    .from("ogiris")
    .select(
      `
      ogiri_id,
      created_at,
      odai,
      group_id,
      ended_at,
      answers (
        answer_id,
        created_at,
        answer,
        score,
        evaluation,
        user_id,
        status,
        users (
          user_id,
          name,
          icon_url
        )
      )`
    )
    .eq("ogiri_id", ogiriId)
    .eq("group_id", groupId);

  const supabaseError = supabaseErrorResponse(error);
  if (supabaseError) return supabaseError;

  if (data?.length !== 1) {
    return new Response(
      createApiErrorString({ message: "Not found", status: 404 }),
      { status: 404 }
    );
  }

  const ogiri = data[0];

  const answers = ogiri.answers
    ? Array.isArray(ogiri.answers)
      ? ogiri.answers
      : [ogiri.answers]
    : [];
  const isAllComplete = answers.every((answer) => answer.status === "complete");

  const headers = {
    "Cache-Control": isAllComplete
      ? "public, max-age=0, s-maxage=3600"
      : "public, max-age=0, s-maxage=10",
  };

  return new Response(JSON.stringify(ogiri), { headers });
};

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
      id,
      created_at,
      odai,
      ended_at,
      answers (
        id,
        created_at,
        answer,
        score,
        evaluation,
        status,
        users (
          id,
          name,
          icon_url
        )
      ),
      groups (
        id,
        name,
        icon_url     
      )`
    )
    .eq("id", ogiriId)
    .eq("group_id", groupId);

  const supabaseError = supabaseErrorResponse(error);
  if (supabaseError) return supabaseError;

  if (data?.length !== 1) {
    return new Response(
      createApiErrorString({ message: "Not found", status: "NOT_FOUND" }),
      { status: 200 }
    );
  }

  const ogiri = data[0];

  const answers = ogiri.answers
    ? Array.isArray(ogiri.answers)
      ? ogiri.answers
      : [ogiri.answers]
    : [];
  const isComplete =
    answers.every((answer) => answer.status === "complete") &&
    new Date(ogiri.ended_at) < new Date();

  ogiri.answers = answers.sort((a, b) => {
    if (!a.score || !b.score) return 0;
    if (a.score > b.score) return -1;
    if (a.score < b.score) return 1;
    return 0;
  });

  const headers = {
    "Cache-Control": isComplete
      ? "public, max-age=0, s-maxage=86400"
      : "public, max-age=0, s-maxage=10, stale-while-revalidate=5",
  };

  return new Response(JSON.stringify(ogiri), { headers });
};

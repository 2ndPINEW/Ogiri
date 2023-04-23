import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../../../core/db/supabase.ts";
import { createApiErrorString } from "../../../../../../util/api.ts";
import { methodGuard } from "../../../../../../util/guards.ts";

interface Answer {
  id: string;
  created_at: string;
  answer: string;
  score: number;
  evaluation: string;
  status: "waiting" | "scoring" | "complete";
  user: User;
}

interface User {
  id: string;
  name: string;
  icon_url: string;
}

export const handler = async (req: Request, ctx: HandlerContext) => {
  const methodGuardResponse = methodGuard(req, ["GET"]);
  if (methodGuardResponse) return methodGuardResponse;

  const { groupId, ogiriId } = ctx.params;

  const { data, error } = await supabase.rpc("get_ogiris", {
    p_group_id: groupId,
    p_ogiri_id: ogiriId,
  });

  const supabaseError = supabaseErrorResponse(error);
  if (supabaseError) return supabaseError;

  const ogiri = data?.[0];
  if (!ogiri) {
    return new Response(
      createApiErrorString({ message: "Not found", status: 404 }),
      { status: 404 }
    );
  }

  const answers = ogiri.answers as unknown as Answer[];
  const isAllComplete = answers.every((answer) => answer.status === "complete");

  const headers = {
    "Cache-Control": isAllComplete
      ? "public, max-age=0, s-maxage=3600"
      : "public, max-age=0, s-maxage=10",
  };

  return new Response(JSON.stringify(data), { headers });
};

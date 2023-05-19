import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../../core/db/supabase.ts";
import { createApiErrorString } from "../../../../../util/api.ts";
import { methodGuard } from "../../../../../util/guards.ts";

export const handler = async (req: Request, ctx: HandlerContext) => {
  const methodGuardResponse = methodGuard(req, ["GET"]);
  if (methodGuardResponse) return methodGuardResponse;

  const { groupId } = ctx.params;

  const { data, error } = await supabase
    .from("ogiris")
    .select(
      `
      id,
      created_at,
      odai,
      ended_at`
    )
    .eq("group_id", groupId);

  const supabaseError = supabaseErrorResponse(error);
  if (supabaseError) return supabaseError;

  if (!data) {
    return new Response(
      createApiErrorString({ message: "Not found", status: "NOT_FOUND" }),
      { status: 404 }
    );
  }

  const headers = {
    "Cache-Control": "public, max-age=0, s-maxage=10",
  };

  return new Response(JSON.stringify(data), { headers });
};

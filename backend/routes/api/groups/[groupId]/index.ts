import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../core/db/supabase.ts";
import { createApiErrorString } from "../../../../util/api.ts";
import { methodGuard } from "../../../../util/guards.ts";

export const handler = async (req: Request, ctx: HandlerContext) => {
  const methodGuardResponse = methodGuard(req, ["GET"]);
  if (methodGuardResponse) return methodGuardResponse;

  const { groupId } = ctx.params;

  const { data, error } = await supabase
    .from("groups")
    .select(
      `
      id,
      created_at,
      name,
      icon_url`
    )
    .eq("id", groupId);

  const supabaseError = supabaseErrorResponse(error);
  if (supabaseError) return supabaseError;

  if (!data || data.length <= 0) {
    return new Response(
      createApiErrorString({ message: "Not found", status: 404 }),
      { status: 404 }
    );
  }

  const headers = {
    "Cache-Control": "public, max-age=0, s-maxage=3600",
  };

  return new Response(JSON.stringify(data[0]), { headers });
};

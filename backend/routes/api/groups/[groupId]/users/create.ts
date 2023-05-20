import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../../core/db/supabase.ts";
import { SuccessString } from "../../../../../util/api.ts";
import {
  bodyPropertyCheck,
  isResponse,
  methodGuard,
} from "../../../../../util/guards.ts";

const requestBodyProperties = [
  {
    key: "userId",
    type: "string",
  },
  {
    key: "userName",
    type: "string",
  },
  {
    key: "iconUrl",
    type: "string",
  },
] as const;

export const handler = async (req: Request, ctx: HandlerContext) => {
  const { groupId } = ctx.params;

  const methodGuardResponse = methodGuard(req, ["POST"]);
  if (methodGuardResponse) return methodGuardResponse;

  const bodyProperty = await bodyPropertyCheck(req, requestBodyProperties);
  if (isResponse(bodyProperty)) return bodyProperty;

  const { userId, userName, iconUrl } = bodyProperty;

  const { error: insertUserError } = await supabase
    .from("users")
    .insert({
      id: userId,
      name: userName,
      icon_url: iconUrl,
      group_id: groupId,
    });
  const supabaseInsertUserError = supabaseErrorResponse(insertUserError);
  if (supabaseInsertUserError) return supabaseInsertUserError;

  return new Response(SuccessString);
};

import { HandlerContext } from "$fresh/server.ts";
import { supabase, supabaseErrorResponse } from "../../../core/db/supabase.ts";
import { SuccessString } from "../../../util/api.ts";
import {
  bodyPropertyCheck,
  isResponse,
  methodGuard,
} from "../../../util/guards.ts";

/**
 * @api {post} /api/groups/create グループ作成
 * グループ作成時にAPIから受け取るリクエストボディの型
 */
const requestBodyProperties = [
  {
    key: "groupId",
    type: "string",
  },
  {
    key: "groupName",
    type: "string",
  },
  {
    key: "iconUrl",
    type: "string",
  },
] as const;

export const handler = async (req: Request, _ctx: HandlerContext) => {
  const methodGuardResponse = methodGuard(req, ["POST"]);
  if (methodGuardResponse) return methodGuardResponse;

  const bodyProperty = await bodyPropertyCheck(req, requestBodyProperties);
  if (isResponse(bodyProperty)) return bodyProperty;

  const { groupId, groupName, iconUrl } = bodyProperty;

  const { error } = await supabase
    .from("groups")
    .insert([{ id: groupId, name: groupName, icon_url: iconUrl }]);

  const supabaseError = supabaseErrorResponse(error);
  if (supabaseError) return supabaseError;

  return new Response(SuccessString);
};

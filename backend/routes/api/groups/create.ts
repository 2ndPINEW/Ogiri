import { HandlerContext } from "$fresh/server.ts";
import { supabase } from "../../../core/db/supabase.ts";
import { SuccessString, createApiErrorString } from "../../../util/api.ts";
import {
  bodyPropertyCheck,
  isResponse,
  postOnly,
} from "../../../util/guards.ts";

export const handler = async (req: Request, _ctx: HandlerContext) => {
  if (postOnly(req)) return postOnly(req);

  const properties = [
    {
      key: "groupId",
      type: "string",
    },
    {
      key: "groupName",
      type: "string",
    },
  ] as const;
  const bodyProperty = await bodyPropertyCheck(req, properties);
  if (isResponse(bodyProperty)) return bodyProperty;

  const { groupId, groupName } = bodyProperty;

  const { error } = await supabase
    .from("groups")
    .insert([{ id: groupId, name: groupName }]);

  if (error) {
    return new Response(
      createApiErrorString({
        message: error.message,
        details: error.details,
        hint: error.hint,
        status: 503,
      }),
      { status: 503 }
    );
  }
  return new Response(SuccessString);
};

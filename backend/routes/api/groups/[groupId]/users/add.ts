import { HandlerContext } from "$fresh/server.ts";
import {
  supabase,
  supabaseErrorResponse,
} from "../../../../../core/db/supabase.ts";
import {
  SuccessString,
  createApiErrorString,
} from "../../../../../util/api.ts";
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
] as const;

export const handler = async (req: Request, ctx: HandlerContext) => {
  const methodGuardResponse = methodGuard(req, ["POST"]);
  if (methodGuardResponse) return methodGuardResponse;

  const bodyProperty = await bodyPropertyCheck(req, requestBodyProperties);
  if (isResponse(bodyProperty)) return bodyProperty;

  const { groupId } = ctx.params;
  const { userId } = bodyProperty;

  const { data: groups } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId);

  const group = groups?.[0];
  if (!group) {
    return new Response(
      createApiErrorString({
        message: "Group not found",
        status: 404,
      }),
      { status: 404 }
    );
  }

  const isExistUserInGroup = group.user_ids.find((id) => id === userId);
  if (isExistUserInGroup) {
    return new Response(
      createApiErrorString({
        message: "User already exists in the group",
        status: 503,
      }),
      { status: 503 }
    );
  }

  const { data: users } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);

  const isExistUser = users?.length === 1;
  if (!isExistUser) {
    return new Response(
      createApiErrorString({
        message: "User not found",
        status: 503,
      }),
      { status: 503 }
    );
  }

  group.user_ids.push(userId);

  const { error: updateGroupUserError } = await supabase
    .from("groups")
    .update({ user_ids: group.user_ids })
    .eq("id", groupId);
  const supabaseUpdateGroupError = supabaseErrorResponse(updateGroupUserError);
  if (supabaseUpdateGroupError) return supabaseUpdateGroupError;

  return new Response(SuccessString);
};

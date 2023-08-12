import { HandlerContext } from "$fresh/server.ts";
import { supabase } from "../../../core/db/supabase.ts";

export const handler = async (_req: Request, _ctx: HandlerContext) => {
  const { error: deleteError } = await supabase
    .from("hc")
    .delete()
    .gt("id", -1);
  const { error: insertError } = await supabase.from("hc").insert({ id: 0 });
  const { error: selectError } = await supabase.from("hc").select("*").limit(1);

  const res = {
    db: {
      delete: deleteError ? "error" : "ok",
      insert: insertError ? "error" : "ok",
      select: selectError ? "error" : "ok",
    },
    message: "success",
    status: 200,
  };
  console.log(res);
  return new Response(JSON.stringify(res));
};

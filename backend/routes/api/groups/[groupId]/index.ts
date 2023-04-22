import { HandlerContext } from "$fresh/server.ts";

export const handler = (req: Request, ctx: HandlerContext) => {
  return new Response(JSON.stringify(ctx.params));
};

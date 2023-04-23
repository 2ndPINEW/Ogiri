import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface State {
  data: string;
}

export async function handler(
  _req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  const resp = await ctx.next();
  if (!resp.headers.has("Cache-Control")) {
    resp.headers.set("Cache-Control", "no-store");
  }
  return resp;
}

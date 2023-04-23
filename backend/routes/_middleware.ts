import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { createApiErrorString } from "../util/api.ts";

interface State {
  data: string;
}

// 404エラーが起きた時、APIの場合はエラーJSONを返し、それ以外の場合はindex.htmlを返すハンドラ
function fallbackHandler(req: Request, resp: Response) {
  if (req.url.includes("/api/")) {
    const error = createApiErrorString({
      message: "Not found",
      status: 404,
    });
    return new Response(error, {
      status: 404,
    });
  } else {
    return new Response(Deno.readFileSync(`${Deno.cwd()}/static/index.html`), {
      status: 200,
      headers: resp.headers,
    });
  }
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  const resp = await ctx.next();
  if (resp.status === 404) {
    return fallbackHandler(req, resp);
  }
  return resp;
}

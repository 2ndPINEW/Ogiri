import { HandlerContext } from "$fresh/server.ts";
import { scoring } from "../../core/ogiri/scoring.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const res = await scoring(
    "空気読めない人がやってきたパーティーのテーマ曲は？",
    "知らん"
  );
  return new Response(JSON.stringify(res));
};

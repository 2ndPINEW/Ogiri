import { createApiErrorString } from "./api.ts";

// この辺のガード系、throwしたいんだけど、middlewareとかでハンドリングする手段がないからしゃーない

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
/**
 * 許可したメソッド以外なら405を返す
 */
export const methodGuard = (req: Request, allowMethods: Method[]) => {
  if (!allowMethods.includes(req.method as Method)) {
    return new Response(
      createApiErrorString({
        message: "Method not allowed",
        status: "BAD_REQUEST",
      }),
      { status: 200 }
    );
  }
};

type Property = { key: string; type: "string" | "number" };
type ExtractTypeByKey<T extends Property, K extends string> = T extends {
  readonly key: K;
  readonly type: infer U;
}
  ? U extends "string"
    ? string
    : U extends "number"
    ? number
    : never
  : never;

/**
 * リクエストボディのプロパティの存在と型チェックを行う
 */
export const bodyPropertyCheck: <P extends readonly Property[]>(
  req: Request,
  properties: P
) => Promise<
  | Response
  | {
      [key in P[number]["key"]]: ExtractTypeByKey<P[number], key>;
    }
> = async (req, properties): any => {
  let json = {};
  try {
    json = await req.json();
  } catch {
    return new Response(
      createApiErrorString({
        message: "Bad Request request body is not valid JSON",
        status: "BAD_REQUEST",
      }),
      { status: 200 }
    );
  }

  // 存在しないプロパティがないかチェックする
  const notExistProperties = properties
    .map((property) => {
      if (json[property.key] === null) {
        return property.key;
      }
    })
    .filter((property) => property !== undefined);

  if (notExistProperties.length > 0) {
    return new Response(
      createApiErrorString({
        message: `Bad Request request body is missing property ${notExistProperties.join(
          ", "
        )}`,
        status: "BAD_REQUEST",
      }),
      { status: 200 }
    );
  }

  // 型が一致しないプロパティがないかチェックする
  const notValidProperties = properties
    .map((property) => {
      const value = json[property.key];
      if (typeof value !== property.type) {
        return property.key;
      }
    })
    .filter((property) => property !== undefined);

  if (notValidProperties.length > 0) {
    return new Response(
      createApiErrorString({
        message: `Bad Request request invalid property ${notValidProperties.join(
          ", "
        )}`,
        status: "BAD_REQUEST",
      }),
      { status: 200 }
    );
  }

  return json;
};

/**
 * レスポンスオブジェクトかどうか
 */
export const isResponse = (response: any): response is Response => {
  return response.status || response.body;
};

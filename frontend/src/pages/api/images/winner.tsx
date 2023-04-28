import { ImageResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

// 勝ったユーザーを表示する
export default function hundler(req: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          color: "black",
        }}
      >
        report
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

import { ImageResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

// お題に対する回答の画像
export default function handler(req: NextRequest) {
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

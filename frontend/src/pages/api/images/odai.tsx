import { ImageResponse, NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

// お題の画像
export default function hundler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const odai = searchParams.get("odai");

  if (!odai) {
    return new Response("odaiを指定してください", {
      status: 400,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          color: "black",
        }}
      >
        {decodeURIComponent(odai)}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

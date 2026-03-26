import { ImageResponse } from "next/og";
// @ts-ignore
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "Content Master SEO";
    const platform = searchParams.get("platform") || "Social Media";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            backgroundImage: "radial-gradient(circle at 25% 25%, #1e293b 0%, #0f172a 100%)",
            color: "#f8fafc",
            padding: "80px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "15px",
                background: "linear-gradient(135deg, #6366f1, #fb7185)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
              }}
            >
              🚀
            </div>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#6366f1" }}>
              ContentMaster
            </div>
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: "900",
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: "20px",
              background: "linear-gradient(135deg, #f8fafc, #94a3b8)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "4px",
            }}
          >
            Optimized for {platform}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

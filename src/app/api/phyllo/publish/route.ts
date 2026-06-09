import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { title, body, platforms } = await request.json();

  const useMock = process.env.PHYLLO_ENV !== "production";

  if (useMock) {
    // Simulate successful publish in sandbox
    return NextResponse.json({
      success: true,
      results: platforms.map((p: string) => ({
        platform: p,
        status: "published",
        message: `Mock publish to ${p} successful`,
      })),
    });
  }

  // In production, call Phyllo Publish API for each platform
  try {
    const { phylloFetch } = await import("@/lib/phyllo");
    const results = [];

    for (const platform of platforms) {
      try {
        const result = await phylloFetch("/v1/social/contents/publish", {
          method: "POST",
          body: JSON.stringify({
            title,
            description: body,
            platform,
            visibility: "PUBLIC",
          }),
        });
        results.push({ platform, status: "published", id: result.id });
      } catch (err) {
        results.push({ platform, status: "failed", error: String(err) });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    const body = JSON.parse(text || "{}");
    const platform = body?.platform || "unknown";
    const mode = body?.mode || "demo";

    // Demo mode — return mock SDK token without calling Phyllo
    if (mode !== "live") {
      return NextResponse.json({
        sdkToken: `mock-sdk-token-${platform}-${Date.now()}`,
        userId: `mock-user-${platform}`,
        platform,
        demo: true,
      });
    }

    // Live mode — call real Phyllo API
    const { phylloFetch } = await import("@/lib/phyllo");

    const user = await phylloFetch("/v1/users", {
      method: "POST",
      body: JSON.stringify({
        name: `bedford-demo-${platform}`,
        external_id: `bedford-${platform}-${Date.now()}`,
      }),
    });

    const sdkToken = await phylloFetch("/v1/sdk-tokens", {
      method: "POST",
      body: JSON.stringify({
        user_id: user.id,
        products: ["IDENTITY", "ENGAGEMENT"],
      }),
    });

    return NextResponse.json({
      sdkToken: sdkToken.sdk_token,
      userId: user.id,
      platform,
    });
  } catch (error) {
    console.error("Connect route error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

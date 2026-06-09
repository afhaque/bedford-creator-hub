import { NextRequest, NextResponse } from "next/server";
import { phylloFetch } from "@/lib/phyllo";

export async function POST(request: NextRequest) {
  const { platform, mode } = await request.json();

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
  try {
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
    return NextResponse.json(
      { error: `Failed to initialize Phyllo Connect: ${error}` },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { phylloFetch } from "@/lib/phyllo";

export async function POST(request: NextRequest) {
  try {
    const { platform } = await request.json();

    // Step 1: Create a Phyllo user (or use existing)
    const user = await phylloFetch("/v1/users", {
      method: "POST",
      body: JSON.stringify({
        name: `bedford-demo-${platform}`,
        external_id: `bedford-${platform}-${Date.now()}`,
      }),
    });

    // Step 2: Generate SDK token for this user
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

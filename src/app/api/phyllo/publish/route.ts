import { NextRequest, NextResponse } from "next/server";
import { phylloFetch, isSandbox } from "@/lib/phyllo";

export async function POST(request: NextRequest) {
  const { title, body, platforms } = await request.json();

  if (isSandbox()) {
    return NextResponse.json({
      success: true,
      results: platforms.map((p: string) => ({
        platform: p,
        status: "published",
        message: `Mock publish to ${p} successful`,
      })),
    });
  }

  try {
    const results = await Promise.allSettled(
      platforms.map((platform: string) =>
        phylloFetch("/v1/social/contents/publish", {
          method: "POST",
          body: JSON.stringify({ title, description: body, platform, visibility: "PUBLIC" }),
        }).then((result) => ({ platform, status: "published" as const, id: result.id }))
      )
    );

    const mapped = results.map((r, i) =>
      r.status === "fulfilled"
        ? r.value
        : { platform: platforms[i], status: "failed" as const, error: String(r.reason) }
    );
    const allSucceeded = mapped.every((r) => r.status === "published");

    return NextResponse.json({ success: allSucceeded, results: mapped });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

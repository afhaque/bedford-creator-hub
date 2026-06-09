import { NextResponse } from "next/server";

export async function GET() {
  const useMock = process.env.PHYLLO_ENV !== "production";

  if (useMock) {
    return NextResponse.json({ profiles: [] });
  }

  try {
    const { phylloFetch } = await import("@/lib/phyllo");
    const data = await phylloFetch("/v1/profiles");
    return NextResponse.json({ profiles: data.data || [] });
  } catch (error) {
    return NextResponse.json({ profiles: [], error: String(error) });
  }
}

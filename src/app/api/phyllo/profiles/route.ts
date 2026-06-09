import { NextResponse } from "next/server";
import { phylloFetch, isSandbox } from "@/lib/phyllo";

export async function GET() {
  if (isSandbox()) {
    return NextResponse.json({ profiles: [] });
  }

  try {
    const data = await phylloFetch("/v1/profiles");
    return NextResponse.json({ profiles: data.data || [] });
  } catch (error) {
    return NextResponse.json({ profiles: [], error: String(error) });
  }
}

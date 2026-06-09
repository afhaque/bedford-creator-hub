import { NextResponse } from "next/server";
import { mockConnectedAccounts } from "@/lib/mock-data";
import { phylloFetch, isSandbox, getPlatformIcon } from "@/lib/phyllo";

export async function GET() {
  if (isSandbox()) {
    return NextResponse.json({ accounts: mockConnectedAccounts });
  }

  try {
    const data = await phylloFetch("/v1/accounts");
    const accounts = (data.data || []).map((acc: Record<string, unknown>) => ({
      id: acc.id,
      platform: (acc.work_platform as Record<string, unknown>)?.name || "Unknown",
      platformIcon: getPlatformIcon(((acc.work_platform as Record<string, unknown>)?.name as string) || ""),
      handle: (acc.username as string) || "unknown",
      status: acc.status,
      followers: 0,
    }));
    return NextResponse.json({ accounts });
  } catch (error) {
    return NextResponse.json({ accounts: mockConnectedAccounts, error: String(error) });
  }
}

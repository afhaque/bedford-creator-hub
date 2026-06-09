import { NextResponse } from "next/server";
import { mockConnectedAccounts } from "@/lib/mock-data";

export async function GET() {
  // In sandbox/demo mode, return mock data
  // In production, this would call Phyllo's GET /v1/accounts
  const useMock = process.env.PHYLLO_ENV !== "production";

  if (useMock) {
    return NextResponse.json({ accounts: mockConnectedAccounts });
  }

  try {
    const { phylloFetch } = await import("@/lib/phyllo");
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

function getPlatformIcon(name: string): string {
  const icons: Record<string, string> = {
    YouTube: "🎬", Instagram: "📸", TikTok: "🎵",
    Facebook: "👤", LinkedIn: "💼", Substack: "📝",
  };
  return icons[name] || "🌐";
}

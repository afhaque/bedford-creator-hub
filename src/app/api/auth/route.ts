import { NextRequest, NextResponse } from "next/server";

const PASSWORD = process.env.SITE_PASSWORD || "Overclock123!";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("bedford-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
}

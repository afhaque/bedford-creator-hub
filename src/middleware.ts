import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/login";
  const authCookie = request.cookies.get("bedford-auth");

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (isLoginPage) {
    if (authCookie?.value === "authenticated") {
      return NextResponse.redirect(new URL("/connect", request.url));
    }
    return NextResponse.next();
  }

  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

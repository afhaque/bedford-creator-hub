import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  const authCookie = request.cookies.get("bedford-auth");

  if (isApiRoute && request.nextUrl.pathname === "/api/auth") {
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

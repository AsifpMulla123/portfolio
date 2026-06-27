// middleware.js — root of project (same level as package.json)
//
// Runs on the Edge BEFORE any page renders.
// Protects all /admin routes except /admin/login.
// Unauthenticated requests are redirected to /admin/login instantly.

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  // Run middleware on ALL /admin routes including /admin itself
  matcher: ["/admin", "/admin/:path*"],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow login page through — no token needed
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // All other /admin routes need a valid token
  const token = request.cookies.get("admin_token")?.value;

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    // JWT_SECRET is a plain string with no $ signs so it reads fine from env
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    // Valid token — allow through to the protected page
    return NextResponse.next();
  } catch {
    // Expired or tampered token → clear cookie and redirect to login
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
    response.cookies.delete("admin_token");
    return response;
  }
}

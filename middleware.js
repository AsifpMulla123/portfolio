import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// WHY JOSE INSTEAD OF JSONWEBTOKEN:
// Next.js middleware runs on the Edge Runtime, which is a lightweight V8-based
// environment that does NOT have access to Node.js built-ins (like crypto, fs, etc.).
// jsonwebtoken depends on Node.js crypto under the hood, so it crashes in Edge Runtime.
// jose is built specifically for Web Crypto API (available everywhere including Edge),
// making it the correct choice for Next.js middleware JWT verification.

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login through without auth check.
  // If we protected login too, a logged-out user could never reach it.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  // No token at all → send to login
  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // jose requires the secret as a Uint8Array, not a plain string
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    // jwtVerify throws if the token is expired, tampered with, or invalid
    await jwtVerify(token, secret);

    // Token is valid — let the request through
    return NextResponse.next();
  } catch (error) {
    // Token exists but is invalid or expired → redirect to login
    console.error("[Middleware] Invalid admin token:", error.message);
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
}

// Only run this middleware on /admin/* routes.
// The :path* wildcard matches every sub-path under /admin.
export const config = {
  matcher: ["/admin/:path*"],
};

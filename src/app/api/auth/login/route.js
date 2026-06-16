import { errorResponse } from "@/lib/utils/apiResponse";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

// WHY HTTPCOOKIE INSTEAD OF LOCALSTORAGE:
// Storing a JWT in localStorage exposes it to any JavaScript running on the page,
// including third-party scripts and XSS payloads. An httpOnly cookie cannot be
// read by JavaScript at all — only the browser sends it automatically on each request.
// Combined with sameSite=strict (blocks CSRF) and secure=true in production
// (HTTPS only), this is the safest way to persist admin sessions in a web app.

// In-memory brute-force tracker.
// Maps IP address → { count: number, lockedUntil: number | null }
// NOTE: This resets on every server restart. For production at scale you would
// store this in Redis or a DB. For a single-admin portfolio site, in-memory is fine.
const loginAttempts = new Map();

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; the first entry is the real client
    return forwarded.split(",")[0].trim();
  }
  return request.ip ?? "unknown";
}

function getAttemptRecord(ip) {
  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, { count: 0, lockedUntil: null });
  }
  return loginAttempts.get(ip);
}

export async function POST(request) {
  try {
    const ip = getClientIp(request);
    const record = getAttemptRecord(ip);

    // Check if the IP is currently locked out
    if (record.lockedUntil && Date.now() < record.lockedUntil) {
      const minutesRemaining = Math.ceil(
        (record.lockedUntil - Date.now()) / 60000,
      );
      
      return errorResponse(
        `Too many failed attempts. Try again in ${minutesRemaining} minute(s).`,
        429,
      );
    }

    // If a previous lock has expired, reset the record
    if (record.lockedUntil && Date.now() >= record.lockedUntil) {
      record.count = 0;
      record.lockedUntil = null;
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      
      return errorResponse("Password is required.", 400);
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error("[Login] ADMIN_PASSWORD env var is not set.");
      
      return errorResponse("Server configuration error.", 500);
    }

    // bcrypt.compare hashes the submitted password and compares it to the stored hash.
    // Never compare plain-text passwords directly.
    const isMatch = await bcrypt.compare(password, adminPassword);

    if (!isMatch) {
      // Increment failed attempt count
      record.count += 1;

      if (record.count >= MAX_ATTEMPTS) {
        record.lockedUntil = Date.now() + LOCK_DURATION_MS;
        record.count = 0; // reset so the counter starts fresh after lockout expires
      
        return errorResponse(
          "Too many failed attempts. Account locked for 15 minutes.",
          429,
        );
      }

      const attemptsLeft = MAX_ATTEMPTS - record.count;
      
      return errorResponse(
        `Incorrect password. ${attemptsLeft} attempt(s) remaining.`,
        401,
      );
    }

    // Password is correct — reset any previous failed attempts
    record.count = 0;
    record.lockedUntil = null;

    // Sign a JWT with jose (edge-compatible, unlike jsonwebtoken)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d") // expires in 1 day
      .sign(secret);

    const response = NextResponse.json(
      { success: true, message: "Login successful.", data: null },
      { status: 200 },
    );
    // Set the JWT as an httpOnly cookie — JavaScript cannot read this value
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      // secure: true means the cookie is only sent over HTTPS.
      // In local development (http://localhost) we allow it without secure.
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // blocks cross-site request forgery
      maxAge: 86400, // 1 day in seconds
      path: "/", // cookie is sent on all routes
    });

    return response;
  } catch (error) {
    console.error("[Login] Unexpected error:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}

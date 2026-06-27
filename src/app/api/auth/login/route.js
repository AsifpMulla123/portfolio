import { errorResponse } from "@/lib/utils/apiResponse";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

// WHY BASE64 FOR THE HASH:
// bcrypt hashes contain $ signs (e.g. $2b$10$...) which Next.js and some
// shell environments interpret as variable substitution, truncating the value.
// Storing the hash as base64 avoids all special characters — we decode it
// back to the real bcrypt hash at runtime before comparing.

const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
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

    if (record.lockedUntil && Date.now() < record.lockedUntil) {
      const minutesRemaining = Math.ceil(
        (record.lockedUntil - Date.now()) / 60000,
      );
      return errorResponse(
        `Too many failed attempts. Try again in ${minutesRemaining} minute(s).`,
        429,
      );
    }

    if (record.lockedUntil && Date.now() >= record.lockedUntil) {
      record.count = 0;
      record.lockedUntil = null;
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return errorResponse("Password is required.", 400);
    }

    // ADMIN_PASSWORD is stored as base64 to avoid $ sign issues in env parsers.
    // Decode it back to the real bcrypt hash before comparing.
    const adminPasswordB64 = process.env.ADMIN_PASSWORD;
    if (!adminPasswordB64) {
      console.error("[Login] ADMIN_PASSWORD env var is not set.");
      return errorResponse("Server configuration error.", 500);
    }

    // Decode base64 → real bcrypt hash (e.g. $2b$10$...)
    const adminPasswordHash = Buffer.from(adminPasswordB64, "base64").toString(
      "utf8",
    );

    const isMatch = await bcrypt.compare(password, adminPasswordHash);

    if (!isMatch) {
      record.count += 1;

      if (record.count >= MAX_ATTEMPTS) {
        record.lockedUntil = Date.now() + LOCK_DURATION_MS;
        record.count = 0;
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

    // Password correct — reset attempts
    record.count = 0;
    record.lockedUntil = null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    const response = NextResponse.json(
      { success: true, message: "Login successful.", data: null },
      { status: 200 },
    );

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Login] Unexpected error:", error);
    return errorResponse("Something went wrong. Please try again.", 500);
  }
}

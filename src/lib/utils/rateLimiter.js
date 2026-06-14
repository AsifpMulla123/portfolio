// ─── In-Memory Rate Limiter ────────────────────────────────────────────────
//
// Stores request timestamps per IP in a Map that lives in server memory.
//
// IMPORTANT: Resets on server restart — acceptable for free tier single instance.
// On Vercel Hobby/Pro, each serverless function invocation MAY use a different
// instance, so this limiter is not perfectly reliable across instances.
// For the portfolio contact form (low traffic), this is fine — it stops
// obvious repeated abuse from the same session, not sophisticated attacks.
//
// If you ever need cross-instance rate limiting, replace this with an
// Upstash Redis rate limiter (they have a free tier).
// ─────────────────────────────────────────────────────────────────────────────

// Map structure: { [ip]: [timestamp1, timestamp2, ...] }
// Each value is an array of Unix timestamps (ms) when requests were made
const requestLog = new Map();

/**
 * Checks whether an IP address has exceeded its request limit.
 *
 * @param {string} ip          - The visitor's IP address (from request headers)
 * @param {number} maxRequests - Max allowed requests within the time window (default: 3)
 * @param {number} windowMs    - Time window in milliseconds (default: 1 hour)
 * @returns {{ allowed: boolean, remaining: number }}
 *
 * @example
 * const { allowed, remaining } = checkRateLimit(ip, 3, 60 * 60 * 1000);
 * if (!allowed) return errorResponse("Too many requests", 429);
 */
export function checkRateLimit(
  ip,
  maxRequests = 3,
  windowMs = 60 * 60 * 1000, // 1 hour in milliseconds
) {
  const now = Date.now();

  // Get existing timestamps for this IP, or start fresh
  const timestamps = requestLog.get(ip) || [];

  // Filter out timestamps that are outside the current time window
  // This is a "sliding window" — old requests expire automatically
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (recentTimestamps.length >= maxRequests) {
    // IP has hit the limit — deny the request
    return {
      allowed: false,
      remaining: 0,
    };
  }

  // Request is allowed — record this timestamp and update the map
  recentTimestamps.push(now);
  requestLog.set(ip, recentTimestamps);

  return {
    allowed: true,
    remaining: maxRequests - recentTimestamps.length,
  };
}

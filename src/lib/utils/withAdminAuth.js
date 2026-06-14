import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { errorResponse } from "./apiResponse";

// ─── Admin Auth Wrapper ────────────────────────────────────────────────────
//
// Usage in any admin API route:
//
//   import { withAdminAuth } from "@/lib/utils/withAdminAuth";
//
//   export const GET = withAdminAuth(async (req) => {
//     // req.admin contains the decoded JWT payload: { id, email, iat, exp }
//     return successResponse(data, "Fetched");
//   });
//
// WHY a wrapper instead of checking auth inside each handler:
//   Avoids repeating the same 10 lines in every admin route.
//   One place to update if the auth logic changes.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wraps a Next.js App Router route handler with admin authentication.
 * Checks for a valid `admin_token` httpOnly cookie before calling the handler.
 *
 * @param {Function} handler - The actual route handler (req, context) => Response
 * @returns {Function}       - Wrapped handler that returns 401 if auth fails
 */
export function withAdminAuth(handler) {
  return async function (req, context) {
    try {
      // Read the httpOnly cookie — this is set at login and only accessible server-side
      // httpOnly means JavaScript in the browser cannot read it (XSS protection)
      const cookieStore = await cookies();
      const token = cookieStore.get("admin_token")?.value;

      if (!token) {
        // No cookie at all — user is not logged in
        return errorResponse("Unauthorized: Please log in", 401);
      }

      // Verify the token signature and expiry using the secret
      // jwt.verify throws if the token is invalid, expired, or tampered with
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded payload to the request so the handler can use it
      // e.g. req.admin.email to log which admin performed an action
      req.admin = decoded;

      // Call the actual route handler now that we know the request is authenticated
      return handler(req, context);
    } catch (error) {
      // jwt.verify throws JsonWebTokenError for invalid tokens
      // and TokenExpiredError for expired ones — both mean unauthorized
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return errorResponse("Unauthorized: Invalid or expired session", 401);
      }

      // Something unexpected went wrong (e.g. JWT_SECRET not set)
      console.error("[withAdminAuth] Unexpected error:", error);
      return errorResponse("Internal server error", 500);
    }
  };
}
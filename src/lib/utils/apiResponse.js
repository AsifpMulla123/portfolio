// ─── API Response Helpers ──────────────────────────────────────────────────
//
// Every API route in this project must return this exact shape:
//   { success: boolean, message: string, data: object | null }
//
// WHY a standard shape: the frontend can always check `result.success` without
// knowing which endpoint it's calling. Error handling becomes one pattern.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a successful JSON response.
 *
 * @param {object|array|null} data    - The payload to send back (query results, created doc, etc.)
 * @param {string}            message - Human-readable success message
 * @param {number}            status  - HTTP status code (default: 200)
 * @returns {Response}
 *
 * @example
 * return successResponse(projects, "Projects fetched", 200);
 * // → { success: true, message: "Projects fetched", data: [...] }
 */
export function successResponse(data = null, message = "Success", status = 200) {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * Returns an error JSON response.
 *
 * @param {string} message - Human-readable error description (safe to show in UI)
 * @param {number} status  - HTTP status code (default: 500)
 * @returns {Response}
 *
 * @example
 * return errorResponse("Project not found", 404);
 * // → { success: false, message: "Project not found", data: null }
 */
export function errorResponse(message = "Something went wrong", status = 500) {
  return Response.json(
    {
      success: false,
      message,
      data: null,
    },
    { status }
  );
}
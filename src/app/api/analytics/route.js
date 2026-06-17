import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Analytics from "@/lib/db/models/Analytics";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

// Valid event types we track — anything else is ignored
const VALID_EVENTS = [
  "page_view",
  "project_click",
  "contact_click",
  "resume_download",
];

// POST /api/analytics — Public, no auth needed
// Tracks a user event (page view, button click, etc.)
export async function POST(request) {
  // Fire and forget pattern — analytics should never affect user experience
  // We return success immediately and let the DB save happen in the background
  const responsePayload = successResponse(null, "Event recorded", 200);

  // Parse and save in the background — intentionally not awaited at top level
  // If this fails silently, the user never knows and never cares
  (async () => {
    try {
      const body = await request.json();
      const { event, page, referrer } = body;

      // Silently ignore invalid events — don't error, just skip
      if (!VALID_EVENTS.includes(event)) {
        return;
      }

      // Grab user agent from request headers for basic device/browser insight
      const userAgent = request.headers.get("user-agent") || "unknown";

      await connectDB();

      await Analytics.create({
        event,
        page: page || "/",
        referrer: referrer || "",
        userAgent,
      });
    } catch (err) {
      // Silently fail — DB might be down, body might be malformed, doesn't matter
      // We never want analytics to bubble up an error to the user
      console.error("[POST /api/analytics] Silent fail:", err.message);
    }
  })();

  // Return immediately — don't wait for DB write above
  return responsePayload;
}

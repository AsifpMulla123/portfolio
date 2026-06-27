import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { revalidatePath } from "next/cache";

// WHAT ON-DEMAND REVALIDATION DOES AND WHEN IT IS TRIGGERED:
//
// The homepage (and other public pages) are built as static HTML at deploy time
// (force-static) so visitors get instant page loads with zero DB hits.
// The downside: if the admin updates a project or blog post, the live site still
// shows the old cached HTML until the next full redeploy.
//
// On-demand revalidation solves this. When the admin clicks "Publish" in the
// dashboard, the PublishButton component calls POST /api/revalidate with a secret
// and the list of page paths that changed. Next.js immediately rebuilds only those
// specific pages in the background, so the next visitor sees fresh content —
// without requiring a full Vercel redeploy.
//
// What gets revalidated depends on what the admin updated:
//   Projects changed  → ['/', '/projects']
//   Blog post changed → ['/', '/blog', '/blog/[slug]']
//   Skills/Experience → ['/']

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      
      return errorResponse("Invalid request body.", 400);
    }

    const { paths, secret } = body;

    // ── Auth Check ────────────────────────────────────────────────────────────
    // This route is intentionally NOT protected by the admin JWT middleware
    // (middleware only runs on /admin/*). Instead we use a shared secret so
    // automated tools or CI pipelines can also trigger revalidation safely.
    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      
      return errorResponse(
        "Unauthorized. Invalid or missing revalidation secret.",
        401,
      );
    }

    // ── Validate Paths ────────────────────────────────────────────────────────
    if (!Array.isArray(paths) || paths.length === 0) {
      
      return errorResponse(
        "paths must be a non-empty array of route strings.",
        400,
      );
    }

    // Ensure every entry is a non-empty string that starts with /
    const invalidPaths = paths.filter(
      (p) => typeof p !== "string" || p.trim() === "" || !p.startsWith("/"),
    );
    if (invalidPaths.length > 0) {
     
      return errorResponse(
        `Invalid paths: ${invalidPaths.join(", ")}. Each path must start with /.`,
        400,
      );
    }

    // ── Revalidate ────────────────────────────────────────────────────────────
    const revalidated = [];

    for (const path of paths) {
      try {
        // revalidatePath marks the cached page as stale.
        // Next.js will regenerate it on the very next request to that path.
        revalidatePath(path);
        revalidated.push(path);
      } catch (pathError) {
        // Log individual failures but continue revalidating remaining paths
        console.error(
          `[Revalidate] Failed to revalidate ${path}:`,
          pathError.message,
        );
      }
    }

    
    return successResponse(
      { revalidated },
      `Successfully revalidated ${revalidated.length} path(s).`,
      200,
    );
  } catch (error) {
    console.error("[Revalidate] Unexpected error:", error);
  
    return errorResponse("Something went wrong during revalidation.", 500);
  }
}

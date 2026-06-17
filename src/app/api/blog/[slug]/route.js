import connectDB from "@/lib/db/mongodb";
import Blog from "@/lib/db/models/Blog";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { withAdminAuth } from "@/lib/utils/withAdminAuth";
import { blogUpdateSchema } from "@/lib/validations/blog";
import readingTime from "reading-time";

// Force static export — individual post pages are rebuilt via PublishButton → /api/revalidate
export const dynamic = "force-static";

// GET /api/blog/[slug] — Public route
// Full content returned here only — not in listing route (which uses /api/blog)
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { slug } = params;

    // Only serve published posts publicly — drafts are admin-only
    const post = await Blog.findOne({ slug, published: true }).lean();

    if (!post) {
      return errorResponse("Blog post not found", 404);
    }

    return successResponse(post, "Blog post fetched", 200);
  } catch (error) {
    console.error("[GET /api/blog/[slug]] Error:", error);
    return errorResponse("Failed to fetch blog post", 500);
  }
}

// PUT /api/blog/[slug] — Admin only
// Partial update — only fields provided in the body are updated
export const PUT = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB();

    const { slug } = params;
    const body = await request.json();

    // Use partial schema — admin may only be updating one or two fields
    const result = blogUpdateSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Validation failed", 400);
    }

    const updates = result.data;

    // Find the current post so we can compare published state and recalculate if needed
    const existingPost = await Blog.findOne({ slug });
    if (!existingPost) {
      return errorResponse("Blog post not found", 404);
    }

    // If admin is publishing for the first time, stamp the publishedAt date
    // We only set it once — don't overwrite if already published
    const wasUnpublished = !existingPost.published;
    const isNowPublished = updates.published === true;
    if (wasUnpublished && isNowPublished) {
      updates.publishedAt = new Date();
    }

    // If content changed, recalculate reading time automatically
    if (updates.content) {
      const stats = readingTime(updates.content);
      updates.readingTime = stats.text;
    }

    // If slug is being changed, check for collision on the new slug
    if (updates.slug && updates.slug !== slug) {
      const slugTaken = await Blog.findOne({ slug: updates.slug });
      if (slugTaken) {
        return errorResponse("A post with this slug already exists", 409);
      }
    }

    const updatedPost = await Blog.findOneAndUpdate(
      { slug },
      { $set: updates },
      { new: true }, // return the updated document
    );

    return successResponse(updatedPost, "Blog post updated", 200);
  } catch (error) {
    console.error("[PUT /api/blog/[slug]] Error:", error);
    return errorResponse("Failed to update blog post", 500);
  }
});

// DELETE /api/blog/[slug] — Admin only
// Hard delete — intentional, admin controls this directly
export const DELETE = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB();

    const { slug } = params;

    const deleted = await Blog.findOneAndDelete({ slug });

    if (!deleted) {
      return errorResponse("Blog post not found", 404);
    }

    return successResponse(null, "Blog post deleted", 200);
  } catch (error) {
    console.error("[DELETE /api/blog/[slug]] Error:", error);
    return errorResponse("Failed to delete blog post", 500);
  }
});

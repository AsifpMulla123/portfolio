import connectDB from "@/lib/db/mongodb";
import Blog from "@/lib/db/models/Blog";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { withAdminAuth } from "@/lib/utils/withAdminAuth";
import { blogSchema } from "@/lib/validations/blog";
import readingTime from "reading-time";

// Force static export — this page is rebuilt only when admin clicks PublishButton
// See: /api/revalidate route for how revalidation is triggered
export const dynamic = "force-static";

// GET /api/blog — Public route
// Returns only published posts with preview fields (no content field — too heavy)
export async function GET() {
  try {
    await connectDB();

    // We exclude content here — full content only fetched on single post page
    const posts = await Blog.find({ published: true })
      .sort({ publishedAt: -1 }) // newest first
      .select("title slug excerpt tags readingTime publishedAt coverImage")
      .lean();

    return successResponse(posts, "Blog posts fetched", 200);
  } catch (error) {
    console.error("[GET /api/blog] Error:", error);
    return errorResponse("Failed to fetch blog posts", 500);
  }
}

// POST /api/blog — Admin only
// Creates a new blog post (draft or published)
export const POST = withAdminAuth(async (request) => {
  try {
    await connectDB();

    const body = await request.json();

    // Validate against blog schema
    const result = blogSchema.safeParse(body);
    if (!result.success) {
      return errorResponse("Validation failed", 400);
    }

    const data = result.data;

    // Auto-generate slug from title if admin didn't provide one
    // e.g. "Why I Switched to Next.js" → "why-i-switched-to-next-js"
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // spaces → hyphens
        .replace(/-+/g, "-"); // collapse multiple hyphens
    }

    // Check for slug collision — slugs must be unique
    const existing = await Blog.findOne({ slug: data.slug });
    if (existing) {
      return errorResponse("A post with this slug already exists", 409);
    }

    // Auto-calculate reading time from content using reading-time package
    const stats = readingTime(data.content);
    data.readingTime = stats.text; // e.g. "5 min read"

    // If publishing immediately, stamp the publishedAt date
    if (data.published) {
      data.publishedAt = new Date();
    }

    const post = await Blog.create(data);

    return successResponse(post, "Blog post created", 201);
  } catch (error) {
    console.error("[POST /api/blog] Error:", error);
    return errorResponse("Failed to create blog post", 500);
  }
});

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Project from "@/lib/db/models/Project";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { withAdminAuth } from "@/lib/utils/withAdminAuth";

// Force-static so this route is built once at deploy time.
// It only rebuilds when the admin clicks the Publish button (on-demand revalidation).
// This means zero DB calls on every visitor request — perfect for the free MongoDB tier.
export const dynamic = "force-static";

// ─── GET /api/projects ────────────────────────────────────────────────────────
// Public. Returns all non-archived projects sorted by their display order.
export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find({ status: { $ne: "archived" } })
      .sort({ order: 1 })
      .select("-__v")
      .lean(); // lean() returns plain JS objects — faster, no Mongoose overhead

    // Transform _id (ObjectId) → id (string) so the client never touches ObjectIds
    const formatted = projects.map((project) => ({
      ...project,
      id: project._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(
      successResponse("Projects fetched successfully", formatted),
    );
  } catch (error) {
    console.error("[GET /api/projects]", error);
    return NextResponse.json(errorResponse("Failed to fetch projects"), {
      status: 500,
    });
  }
}

// ─── POST /api/projects ───────────────────────────────────────────────────────
// Admin only. Creates a new project document.
export const POST = withAdminAuth(async (request) => {
  try {
    await connectDB();

    const body = await request.json();

    const {
      title,
      slug,
      tagline,
      description,
      problem,
      solution,
      techStack,
      category,
      links,
      featured,
      order,
      status,
      highlights,
    } = body;

    // Title is the only truly required field to create a project draft
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(errorResponse("Project title is required"), {
        status: 400,
      });
    }

    // Auto-generate slug from title if one wasn't provided
    // e.g. "TaskFlow AI" → "taskflow-ai"
    const finalSlug =
      slug && slug.trim() !== ""
        ? slug.trim()
        : title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^a-z0-9-]/g, "");

    // Check for slug collision before inserting
    const existing = await Project.findOne({ slug: finalSlug });
    if (existing) {
      return NextResponse.json(
        errorResponse(
          `Slug "${finalSlug}" is already taken. Provide a unique slug.`,
        ),
        { status: 409 },
      );
    }

    const project = await Project.create({
      title: title.trim(),
      slug: finalSlug,
      tagline: tagline?.trim() || "",
      description: description?.trim() || "",
      problem: problem?.trim() || "",
      solution: solution?.trim() || "",
      techStack: Array.isArray(techStack) ? techStack : [],
      category: category || "Other",
      links: links || {},
      featured: featured ?? false,
      order: order ?? 0,
      status: status || "draft",
      highlights: Array.isArray(highlights) ? highlights : [],
    });

    const created = {
      ...project.toObject(),
      id: project._id.toString(),
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json(
      successResponse("Project created successfully", created),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("[POST /api/projects]", error);
    return NextResponse.json(errorResponse("Failed to create project"), {
      status: 500,
    });
  }
});

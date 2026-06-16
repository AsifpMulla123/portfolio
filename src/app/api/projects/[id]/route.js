import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Project from "@/lib/db/models/Project";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { withAdminAuth } from "@/lib/utils/withAdminAuth";

// ─── GET /api/projects/[id] ───────────────────────────────────────────────────
// Public. Returns a single project by its MongoDB _id.
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const project = await Project.findById(id).select("-__v").lean();

    if (!project) {
      return NextResponse.json(errorResponse("Project not found"), {
        status: 404,
      });
    }

    const formatted = {
      ...project,
      id: project._id.toString(),
      _id: undefined,
    };

    return NextResponse.json(
      successResponse("Project fetched successfully", formatted),
    );
  } catch (error) {
    console.error("[GET /api/projects/[id]]", error);
    return NextResponse.json(errorResponse("Failed to fetch project"), {
      status: 500,
    });
  }
}

// ─── PUT /api/projects/[id] ───────────────────────────────────────────────────
// Admin only. Supports partial updates — only fields present in the body are updated.
// This lets the admin form send just the changed fields without wiping the rest.
export const PUT = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    // Build update object from only the fields that were actually sent
    const allowedFields = [
      "title",
      "slug",
      "tagline",
      "description",
      "problem",
      "solution",
      "techStack",
      "category",
      "links",
      "featured",
      "order",
      "status",
      "highlights",
    ];

    const updates = {};
    for (const field of allowedFields) {
      // Use hasOwnProperty so we don't accidentally set undefined for missing fields
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        errorResponse("No valid fields provided to update"),
        { status: 400 },
      );
    }

    // If slug is being updated, check it doesn't collide with another project
    if (updates.slug) {
      const collision = await Project.findOne({
        slug: updates.slug,
        _id: { $ne: id },
      });
      if (collision) {
        return NextResponse.json(
          errorResponse(
            `Slug "${updates.slug}" is already taken by another project.`,
          ),
          { status: 409 },
        );
      }
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true, // return the updated document, not the old one
        runValidators: true, // run schema validators on the update
      },
    )
      .select("-__v")
      .lean();

    if (!updated) {
      return NextResponse.json(errorResponse("Project not found"), {
        status: 404,
      });
    }

    const formatted = {
      ...updated,
      id: updated._id.toString(),
      _id: undefined,
    };

    return NextResponse.json(
      successResponse("Project updated successfully", formatted),
    );
  } catch (error) {
    console.error("[PUT /api/projects/[id]]", error);
    return NextResponse.json(errorResponse("Failed to update project"), {
      status: 500,
    });
  }
});

// ─── DELETE /api/projects/[id] ────────────────────────────────────────────────
// Admin only. Soft delete — we archive instead of delete so data is recoverable.
// The GET /api/projects route filters out archived projects automatically.
export const DELETE = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB();

    const { id } = params;

    const project = await Project.findByIdAndUpdate(
      id,
      { $set: { status: "archived" } },
      { new: true },
    );

    if (!project) {
      return NextResponse.json(errorResponse("Project not found"), {
        status: 404,
      });
    }

    return NextResponse.json(
      successResponse("Project archived successfully", null),
    );
  } catch (error) {
    console.error("[DELETE /api/projects/[id]]", error);
    return NextResponse.json(errorResponse("Failed to archive project"), {
      status: 500,
    });
  }
});

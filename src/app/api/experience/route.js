import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Experience from "@/lib/db/models/Experience";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { withAdminAuth } from "@/lib/utils/withAdminAuth";

// Force-static so this route is built once at deploy time.
// It only rebuilds when the admin clicks the Publish button (on-demand revalidation).
// This means zero DB calls on every visitor request — perfect for the free MongoDB tier.
export const dynamic = "force-static";

// ─── GET /api/experience ──────────────────────────────────────────────────────
// Public. Returns all experience entries sorted by display order.
// Most recent role should have the lowest order value (e.g. order: 0).
export async function GET() {
  try {
    await connectDB();

    const experiences = await Experience.find({})
      .sort({ order: 1 })
      .select("-__v")
      .lean();

    const formatted = experiences.map((exp) => ({
      ...exp,
      id: exp._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(
      successResponse("Experience fetched successfully", formatted),
    );
  } catch (error) {
    console.error("[GET /api/experience]", error);
    return NextResponse.json(errorResponse("Failed to fetch experience"), {
      status: 500,
    });
  }
}

// ─── POST /api/experience ─────────────────────────────────────────────────────
// Admin only. Creates a new experience entry.
export const POST = withAdminAuth(async (request) => {
  try {
    await connectDB();

    const body = await request.json();

    const {
      company,
      role,
      type,
      location,
      locationType,
      startDate,
      endDate,
      current,
      description,
      highlights,
      techStack,
      order,
    } = body;

    // Validate the fields that are always required
    if (!company || typeof company !== "string" || company.trim() === "") {
      return NextResponse.json(errorResponse("Company name is required"), {
        status: 400,
      });
    }

    if (!role || typeof role !== "string" || role.trim() === "") {
      return NextResponse.json(errorResponse("Role / job title is required"), {
        status: 400,
      });
    }

    if (!startDate) {
      return NextResponse.json(errorResponse("Start date is required"), {
        status: 400,
      });
    }

    // If this is not the current role, an end date must be provided
    if (!current && !endDate) {
      return NextResponse.json(
        errorResponse("End date is required unless this is the current role"),
        { status: 400 },
      );
    }

    const experience = await Experience.create({
      company: company.trim(),
      role: role.trim(),
      type: type || "Full-time",
      location: location?.trim() || "",
      locationType: locationType || "Remote",
      startDate: new Date(startDate),
      endDate: current ? null : new Date(endDate),
      current: current ?? false,
      description: description?.trim() || "",
      highlights: Array.isArray(highlights) ? highlights : [],
      techStack: Array.isArray(techStack) ? techStack : [],
      order: order ?? 0,
    });

    const created = {
      ...experience.toObject(),
      id: experience._id.toString(),
      _id: undefined,
      __v: undefined,
    };

    return NextResponse.json(
      successResponse("Experience entry created successfully", created),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("[POST /api/experience]", error);
    return NextResponse.json(
      errorResponse("Failed to create experience entry"),
      { status: 500 },
    );
  }
});

import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Experience from "@/lib/db/models/Experience";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { withAdminAuth } from "@/lib/utils/withAdminAuth";

// ─── PUT /api/experience/[id] ─────────────────────────────────────────────────
// Admin only. Partial update — only the fields sent in the body are updated.
// This is useful when the admin edits just the description or highlights
// without touching dates or other fields.
export const PUT = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();

    const allowedFields = [
      "company",
      "role",
      "type",
      "location",
      "locationType",
      "startDate",
      "endDate",
      "current",
      "description",
      "highlights",
      "techStack",
      "order",
    ];

    const updates = {};
    for (const field of allowedFields) {
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

    // If "current" is being set to true, clear the endDate.
    // We don't want a stale end date sitting alongside current: true.
    if (updates.current === true) {
      updates.endDate = null;
    }

    // Convert date strings to Date objects if they were sent
    if (updates.startDate) {
      updates.startDate = new Date(updates.startDate);
    }
    if (updates.endDate) {
      updates.endDate = new Date(updates.endDate);
    }

    const updated = await Experience.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true, // return the updated document, not the original
        runValidators: true, // run schema validators on the updated fields
      },
    )
      .select("-__v")
      .lean();

    if (!updated) {
      return NextResponse.json(errorResponse("Experience entry not found"), {
        status: 404,
      });
    }

    const formatted = {
      ...updated,
      id: updated._id.toString(),
      _id: undefined,
    };

    return NextResponse.json(
      successResponse("Experience entry updated successfully", formatted),
    );
  } catch (error) {
    console.error("[PUT /api/experience/[id]]", error);
    return NextResponse.json(
      errorResponse("Failed to update experience entry"),
      { status: 500 },
    );
  }
});

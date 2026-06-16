import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Skill from '@/lib/db/models/Skill'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import { withAdminAuth } from '@/lib/utils/withAdminAuth'

// Valid skill categories — must match the Skill model enum exactly
const VALID_CATEGORIES = ['Frontend', 'Backend', 'Languages & DSA', 'Cloud & Tools']

// ─── PUT /api/skills/[id] ─────────────────────────────────────────────────────
// Admin only. Partial update — only send the fields you want to change.
export const PUT = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { id } = params
    const body = await request.json()

    const allowedFields = ['name', 'category', 'icon', 'order']

    const updates = {}
    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        updates[field] = body[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(errorResponse('No valid fields provided to update'), { status: 400 })
    }

    // Validate category if it's being updated
    if (updates.category && !VALID_CATEGORIES.includes(updates.category)) {
      return NextResponse.json(
        errorResponse(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
        { status: 400 }
      )
    }

    const updated = await Skill.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,           // return the updated document
        runValidators: true, // run schema validators on updated fields
      }
    )
      .select('-__v')
      .lean()

    if (!updated) {
      return NextResponse.json(errorResponse('Skill not found'), { status: 404 })
    }

    const formatted = {
      ...updated,
      id: updated._id.toString(),
      _id: undefined,
    }

    return NextResponse.json(successResponse('Skill updated successfully', formatted))
  } catch (error) {
    console.error('[PUT /api/skills/[id]]', error)
    return NextResponse.json(errorResponse('Failed to update skill'), { status: 500 })
  }
})

// ─── DELETE /api/skills/[id] ──────────────────────────────────────────────────
// Admin only. Hard delete is fine here — skills have no relational data.
// Unlike projects, there's nothing to recover if a skill is deleted.
export const DELETE = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { id } = params

    const deleted = await Skill.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json(errorResponse('Skill not found'), { status: 404 })
    }

    return NextResponse.json(successResponse('Skill deleted successfully', null))
  } catch (error) {
    console.error('[DELETE /api/skills/[id]]', error)
    return NextResponse.json(errorResponse('Failed to delete skill'), { status: 500 })
  }
})
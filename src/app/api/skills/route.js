import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongodb'
import Skill from '@/lib/db/models/Skill'
import { successResponse, errorResponse } from '@/lib/utils/apiResponse'
import { withAdminAuth } from '@/lib/utils/withAdminAuth'

// Force-static so this route is built once at deploy time.
// It only rebuilds when the admin clicks the Publish button (on-demand revalidation).
// This means zero DB calls on every visitor request — perfect for the free MongoDB tier.
export const dynamic = 'force-static'

// Valid skill categories — must match the Skill model enum exactly
const VALID_CATEGORIES = ['Frontend', 'Backend', 'Languages & DSA', 'Cloud & Tools']

// ─── GET /api/skills ──────────────────────────────────────────────────────────
// Public. Returns skills grouped by category so the client renders them directly.
// Grouping on the server saves every visitor's browser from doing this work.
export async function GET() {
  try {
    await connectDB()

    const skills = await Skill.find({})
      .sort({ category: 1, order: 1 }) // sort by category first, then display order within it
      .select('-__v')
      .lean()

    // Group skills into { 'Frontend': [...], 'Backend': [...], ... }
    // reduce builds the object in one pass — no need for a second loop
    const grouped = skills.reduce((acc, skill) => {
      const category = skill.category

      if (!acc[category]) {
        acc[category] = []
      }

      acc[category].push({
        ...skill,
        id: skill._id.toString(),
        _id: undefined,
      })

      return acc
    }, {})

    return NextResponse.json(successResponse('Skills fetched successfully', grouped))
  } catch (error) {
    console.error('[GET /api/skills]', error)
    return NextResponse.json(errorResponse('Failed to fetch skills'), { status: 500 })
  }
}

// ─── POST /api/skills ─────────────────────────────────────────────────────────
// Admin only. Creates a new skill.
export const POST = withAdminAuth(async (request) => {
  try {
    await connectDB()

    const body = await request.json()
    const { name, category, icon, order } = body

    // Validate required fields before hitting the DB
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(errorResponse('Skill name is required'), { status: 400 })
    }

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        errorResponse(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
        { status: 400 }
      )
    }

    if (!icon || typeof icon !== 'string' || icon.trim() === '') {
      return NextResponse.json(errorResponse('Skill icon is required'), { status: 400 })
    }

    const skill = await Skill.create({
      name: name.trim(),
      category,
      icon: icon.trim(),
      order: order ?? 0,
    })

    const created = {
      ...skill.toObject(),
      id: skill._id.toString(),
      _id: undefined,
      __v: undefined,
    }

    return NextResponse.json(successResponse('Skill created successfully', created), {
      status: 201,
    })
  } catch (error) {
    console.error('[POST /api/skills]', error)
    return NextResponse.json(errorResponse('Failed to create skill'), { status: 500 })
  }
})
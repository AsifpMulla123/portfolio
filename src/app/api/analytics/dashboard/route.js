import connectDB from "@/lib/db/mongodb";
import Analytics from "@/lib/db/models/Analytics";
import Contact from "@/lib/db/models/Contact";
import Blog from "@/lib/db/models/Blog";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { withAdminAuth } from "@/lib/utils/withAdminAuth";

// GET /api/analytics/dashboard — Admin only
// All aggregations in one request — better than 6 separate API calls
export const GET = withAdminAuth(async (request) => {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Default to last 30 days — cap at 90 so we don't pull too much data
    let days = parseInt(searchParams.get("days") || "30", 10);
    if (isNaN(days) || days < 1) days = 30;
    if (days > 90) days = 90;

    // Calculate the start date for the time-window queries
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // --- 1. Total page views (all time) ---
    const totalPageViews = await Analytics.countDocuments({
      event: "page_view",
    });

    // --- 2. Page views per day for the last [days] days ---
    // Groups by date string (e.g. "2025-01-14"), counts per day, sorted oldest → newest
    const pageViewsByDay = await Analytics.aggregate([
      {
        $match: {
          event: "page_view",
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // ascending so chart renders left to right chronologically
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
        },
      },
    ]);

    // --- 3. Top 5 pages by total views (all time) ---
    const topPages = await Analytics.aggregate([
      {
        $match: { event: "page_view" },
      },
      {
        $group: {
          _id: "$page",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          page: "$_id",
          count: 1,
        },
      },
    ]);

    // --- 4. Total unique contacts (count all Contact documents) ---
    const totalContacts = await Contact.countDocuments();

    // --- 5. Contact subject breakdown ---
    // Returns how many contacts per subject: { "Job Opportunity": 3, "Freelance": 1, ... }
    const contactSubjectAgg = await Contact.aggregate([
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          count: 1,
        },
      },
    ]);

    // Convert array to object for easier consumption in the admin chart
    // e.g. [{ subject: "Freelance", count: 2 }] → { Freelance: 2 }
    const contactsBySubject = contactSubjectAgg.reduce((acc, item) => {
      acc[item.subject] = item.count;
      return acc;
    }, {});

    // --- 6. Total published blog posts ---
    const totalBlogPosts = await Blog.countDocuments({ published: true });

    // Return all data in a single response — avoids waterfall requests from admin UI
    return successResponse(
      {
        totalPageViews,
        pageViewsByDay,
        topPages,
        totalContacts,
        contactsBySubject,
        totalBlogPosts,
      },
      "Dashboard data fetched",
      200,
    );
  } catch (error) {
    console.error("[GET /api/analytics/dashboard] Error:", error);
    return errorResponse("Failed to fetch dashboard data", 500);
  }
});

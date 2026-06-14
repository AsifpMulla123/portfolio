import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    // Type of event being tracked
    // 'page_view'       — someone visited a page
    // 'project_click'   — someone clicked on a project card
    // 'contact_click'   — someone opened the contact form
    // 'resume_download' — someone downloaded the resume PDF
    event: {
      type: String,
      required: [true, "Event type is required"],
      enum: {
        values: ["page_view", "project_click", "contact_click", "resume_download"],
        message: "Invalid event type",
      },
    },

    // The URL path where the event occurred (e.g. "/", "/blog/my-post")
    page: {
      type: String,
      required: [true, "Page path is required"],
    },

    // Where the visitor came from — empty string if direct traffic
    referrer: {
      type: String,
      default: "",
    },

    // Stored for bot detection / filtering in the analytics dashboard
    // Not displayed to the admin in readable form
    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

// TTL index: MongoDB automatically deletes documents older than 90 days
// This keeps the free tier (512MB M0) from filling up with analytics data
// 7776000 seconds = 90 days × 24 hours × 60 minutes × 60 seconds
AnalyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Query by event type with time range — used in the analytics dashboard charts
AnalyticsSchema.index({ event: 1, createdAt: -1 });

// Query all events for a specific page — used in per-page view counts
AnalyticsSchema.index({ page: 1 });

// ─── Export ──────────────────────────────────────────────────────────────────

const Analytics =
  mongoose.models.Analytics || mongoose.model("Analytics", AnalyticsSchema);

export default Analytics;
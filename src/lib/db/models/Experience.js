import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    role: {
      type: String,
      required: [true, "Job role is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: {
        values: ["Full-time", "Part-time", "Contract", "Internship"],
        message: "Type must be one of: Full-time, Part-time, Contract, Internship",
      },
      default: "Full-time",
    },

    // Stored as strings for flexibility (e.g. "January 2024" or "Jan 2024")
    // Not Date type — we don't need date arithmetic, just display
    startDate: {
      type: String,
      required: [true, "Start date is required"],
    },

    // "Present" string means the person is currently in this role
    endDate: {
      type: String,
      default: "Present",
    },

    location: {
      type: String,
      default: "Remote",
    },

    // Paragraph shown under the role — what the job involved overall
    description: {
      type: String,
      required: [true, "Job description is required"],
    },

    // Bullet points for specific wins: "Reduced API response time by 40%"
    achievements: {
      type: [String],
      default: [],
    },

    // Technologies used at this job — shown as badges
    techStack: {
      type: [String],
      default: [],
    },

    // Manual sort order — if multiple jobs, controls which appears first
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Export ──────────────────────────────────────────────────────────────────

const Experience =
  mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);

export default Experience;
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // URL-safe identifier — generated from title in the admin form
    // e.g. "TaskFlow AI" → "taskflow-ai"
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // One-liner shown on project cards (e.g. "AI-powered task prioritization for dev teams")
    tagline: {
      type: String,
      required: [true, "Tagline is required"],
      maxlength: [200, "Tagline cannot exceed 200 characters"],
    },

    // Longer description shown on project detail view
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    // What pain point this project addresses — shown as "Problem" on detail page
    problem: {
      type: String,
      required: [true, "Problem statement is required"],
    },

    // How the project addresses it — shown as "Solution" on detail page
    solution: {
      type: String,
      required: [true, "Solution description is required"],
    },

    // Array of tech names: ["Next.js", "MongoDB", "OpenAI API"]
    techStack: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      enum: {
        values: ["SaaS", "DevOps", "Analytics", "AI", "Marketplace"],
        message:
          "Category must be one of: SaaS, DevOps, Analytics, AI, Marketplace",
      },
      required: [true, "Category is required"],
    },

    // External URLs — default to empty string so we can always check truthiness
    links: {
      live: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
    },

    // Path to project screenshot stored in /public/images/
    image: {
      type: String,
      default: "/images/project-placeholder.png",
    },

    // Featured projects appear first / larger on the portfolio homepage
    featured: {
      type: Boolean,
      default: false,
    },

    // Manual sort order — lower number = appears earlier
    order: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: {
        values: ["live", "development", "archived"],
        message: "Status must be one of: live, development, archived",
      },
      default: "live",
    },

    // 3–4 bullet points shown in a highlights list on the detail page
    // e.g. ["Reduced task sorting time by 80%", "Supports teams of up to 50 users"]
    highlights: {
      type: [String],
      default: [],
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

// Filter by category on projects page (e.g. "show only AI projects")
ProjectSchema.index({ category: 1 });

// Default sort on homepage: featured projects first, then by manual order
ProjectSchema.index({ featured: -1, order: 1 });

// Fast lookup by slug for project detail pages
ProjectSchema.index({ slug: 1 });

// ─── Export ──────────────────────────────────────────────────────────────────

// Guard against re-compiling the model on hot reloads (Next.js dev mode issue)
const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;

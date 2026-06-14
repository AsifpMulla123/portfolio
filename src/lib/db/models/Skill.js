import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },

    // Groups skills into sections on the Skills page
    category: {
      type: String,
      enum: {
        values: ["Frontend", "Backend", "Languages & DSA", "Cloud & Tools"],
        message:
          "Category must be one of: Frontend, Backend, Languages & DSA, Cloud & Tools",
      },
      required: [true, "Category is required"],
    },

    // react-icons identifier string — used to dynamically render the correct icon
    // e.g. "SiReact" maps to the React logo from simple-icons
    // The admin form should show a preview so the identifier can be verified
    icon: {
      type: String,
      required: [true, "Icon identifier is required"],
    },

    // Controls display order within each category — lower = appears first
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

// Used when fetching all skills grouped by category (the most common query)
SkillSchema.index({ category: 1, order: 1 });

// ─── Export ──────────────────────────────────────────────────────────────────

const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

export default Skill;

import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    // Helps categorize inbound messages in the admin inbox
    subject: {
      type: String,
      enum: {
        values: ["Job Opportunity", "Project Inquiry", "Freelance", "General"],
        message: "Subject must be one of: Job Opportunity, Project Inquiry, Freelance, General",
      },
      required: [true, "Subject is required"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },

    // Tracks whether the admin has viewed/read this message
    read: {
      type: Boolean,
      default: false,
    },

    // Stored for rate limiting cross-reference and abuse investigation ONLY
    // Never returned to the client — the API must strip this field from responses
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

// Admin inbox shows newest messages first
ContactSchema.index({ createdAt: -1 });

// Filter unread messages in the admin panel
ContactSchema.index({ read: 1 });

// ─── Export ──────────────────────────────────────────────────────────────────

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export default Contact;
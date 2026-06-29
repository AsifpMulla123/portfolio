import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    // URL-safe identifier for the blog post route: /blog/[slug]
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Short preview shown on blog listing cards — NOT the full post
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
    },

    // Full post content in Markdown — rendered with a Markdown parser on the frontend
    content: {
      type: String,
      required: [true, "Content is required"],
    },

    // Array of lowercase tag strings: ["react", "next.js", "backend"]
    tags: {
      type: [String],
      trim: true,
      lowercase: true,
      default: [],
    },

    // Displayed as "X min read" — calculated or manually set in admin form
    readingTime: {
      type: String,
      default: "5 min read",
    },

    // Draft vs published — only published posts appear on the public blog page
    published: {
      type: Boolean,
      default: false,
    },

    // Set automatically when admin first publishes the post
    // Used for "Published on Jan 15, 2025" display and for sorting newest first
    publishedAt: {
      type: Date,
    },

    // Path to cover image stored in /public/images/
    coverImage: {
      type: String,
      default: "/images/blog-placeholder.png",
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

// Main listing query: only published posts, newest first
BlogSchema.index({ published: 1, publishedAt: -1 });

// Tag filtering on the blog page
BlogSchema.index({ tags: 1 });

// ─── Export ──────────────────────────────────────────────────────────────────

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
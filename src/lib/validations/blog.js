import { z } from "zod";

// Schema for creating a new blog post
export const createBlogSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be under 150 characters")
    .trim(),

  // Slug is optional — we auto-generate from title if not provided
  slug: z.string().trim().optional(),

  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(300, "Excerpt must be under 300 characters")
    .trim(),

  // Full markdown content — must be substantial
  content: z.string().min(50, "Content must be at least 50 characters"),

  // Tags stored lowercase for consistent filtering
  tags: z.array(z.string().trim().toLowerCase()).default([]),

  // Reading time is calculated server-side, but can be overridden
  readingTime: z.string().optional(),

  // Draft by default — admin must explicitly publish
  published: z.boolean().default(false),

  coverImage: z.string().optional(),
});

// Schema for updating a post — all fields optional (partial update)
export const updateBlogSchema = createBlogSchema.partial();

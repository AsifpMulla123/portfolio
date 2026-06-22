"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiFileText, FiClock, FiCalendar } from "react-icons/fi";

// Formats an ISO date string into a short readable date, e.g. "Jan 12, 2025"
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogCard({ post }) {
  const { title, slug, excerpt, tags, readingTime, publishedAt, coverImage } =
    post;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        href={`/blog/${slug}`}
        className="group block h-full bg-card text-foreground border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 shadow-card hover:shadow-card-hover"
      >
        {/* Cover image or gradient placeholder */}
        {coverImage ? (
          <div className="relative h-48 w-full">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : (
          <div className="h-48 w-full bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center">
            <FiFileText className="text-portfolio-accent" size={40} />
          </div>
        )}

        {/* Body */}
        <div className="p-5">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-muted-foreground text-xs rounded-full px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-heading font-bold text-lg mt-2 text-foreground transition-colors duration-200 group-hover:text-portfolio-accent">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground text-sm leading-relaxed mt-2 line-clamp-3">
            {excerpt}
          </p>

          {/* Bottom meta row */}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <FiClock size={14} />
                {readingTime}
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar size={14} />
                {formatDate(publishedAt)}
              </span>
            </div>
            <span className="text-portfolio-accent group-hover:underline">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

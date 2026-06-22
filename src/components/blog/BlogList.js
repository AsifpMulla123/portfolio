"use client";

import { useMemo, useState } from "react";
import BlogCard from "@/components/blog/BlogCard";

export default function BlogList({ posts }) {
  const [activeTag, setActiveTag] = useState("All");

  // Build a unique, sorted list of tags from every post
  const tags = useMemo(() => {
    const tagSet = new Set();
    posts.forEach((post) => {
      (post.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return ["All", ...Array.from(tagSet).sort()];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (activeTag === "All") return posts;
    return posts.filter((post) => (post.tags || []).includes(activeTag));
  }, [posts, activeTag]);

  return (
    <div>
      {/* Tag filter row */}
      <div className="flex flex-wrap gap-2 mb-10">
        {tags.map((tag) => {
          const isActive = tag === activeTag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`text-sm rounded-full px-4 py-1.5 transition-colors duration-200 ${
                isActive
                  ? "bg-portfolio-accent text-white"
                  : "bg-secondary text-muted-foreground hover:bg-portfolio-accent/10 hover:text-portfolio-accent"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Posts grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-12">
          No articles found for this tag.
        </p>
      )}
    </div>
  );
}

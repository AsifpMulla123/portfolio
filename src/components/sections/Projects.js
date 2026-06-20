"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX, FiExternalLink, FiGithub } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/shared/SectionHeading";

// Static projects data — no API call needed on public site
const projects = [
  {
    id: 1,
    title: "TaskFlow AI",
    category: "AI",
    status: "live",
    tagline: "AI-powered project management with smart task scheduling",
    problem:
      "Teams waste hours manually prioritizing tasks and assigning work during every sprint.",
    techStack: [
      "Next.js",
      "MongoDB",
      "OpenAI API",
      "Tailwind CSS",
      "Redux Toolkit",
    ],
    highlights: [
      "Smart sprint planning",
      "AI task suggestions",
      "Team workload visualization",
      "Real-time updates",
    ],
    links: {
      live: "https://taskflow-ai.vercel.app",
      github: "https://github.com/asif-dev/taskflow-ai",
    },
  },
  {
    id: 2,
    title: "CodeCollab",
    category: "SaaS",
    status: "live",
    tagline: "Real-time collaborative code editor for remote engineering teams",
    problem:
      "Remote developers lack a lightweight tool for live code reviews without sharing screens.",
    techStack: ["React", "Node.js", "Socket.io", "Express", "MongoDB"],
    highlights: [
      "Real-time multi-cursor editing",
      "Syntax highlighting",
      "Session sharing",
      "Built-in chat",
    ],
    links: {
      live: "https://codecollab-app.vercel.app",
      github: "https://github.com/asif-dev/codecollab",
    },
  },
  {
    id: 3,
    title: "ShopMetrics",
    category: "Analytics",
    status: "live",
    tagline: "E-commerce analytics dashboard built for small online stores",
    problem:
      "Small e-commerce businesses cannot afford enterprise analytics platforms like Mixpanel.",
    techStack: ["Next.js", "Recharts", "MongoDB", "Tailwind CSS", "Node.js"],
    highlights: [
      "Revenue charts",
      "Product performance",
      "Customer funnel analysis",
      "CSV export",
    ],
    links: {
      live: "https://shopmetrics.vercel.app",
      github: "https://github.com/asif-dev/shopmetrics",
    },
  },
  {
    id: 4,
    title: "CloudWatch Pro",
    category: "DevOps",
    status: "live",
    tagline: "Uptime monitoring and alerting for developer projects",
    problem:
      "Indie developers need affordable uptime monitoring without enterprise setup complexity.",
    techStack: ["Node.js", "Express", "MongoDB", "React", "AWS SDK"],
    highlights: [
      "Endpoint monitoring",
      "Email alerts",
      "Uptime history",
      "Response time graphs",
    ],
    links: {
      live: "https://cloudwatch-pro.vercel.app",
      github: "https://github.com/asif-dev/cloudwatch-pro",
    },
  },
  {
    id: 5,
    title: "APIHub",
    category: "Marketplace",
    status: "live",
    tagline: "Curated marketplace of public APIs with live testing",
    problem:
      "Developers spend hours hunting for reliable, well-documented public APIs across scattered resources.",
    techStack: ["Next.js", "MongoDB", "Tailwind CSS", "React Query", "JWT"],
    highlights: [
      "Live API testing console",
      "Category filtering",
      "Bookmark collections",
      "Search",
    ],
    links: {
      live: "https://apihub.vercel.app",
      github: "https://github.com/asif-dev/apihub",
    },
  },
];

// Category filter options — 'All' always first
const filterOptions = [
  "All",
  "SaaS",
  "AI",
  "Analytics",
  "DevOps",
  "Marketplace",
];

// Category badge styles — purple is allowed only here as a category label
const categoryStyles = {
  AI: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  SaaS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Analytics:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  DevOps:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Marketplace:
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
};

// Framer Motion variants for the grid — staggers children cards in
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// Single project card component
function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 30px 0 rgba(37, 99, 235, 0.12)"
          : "0 1px 4px 0 rgba(0,0,0,0.06)",
        borderLeft: hovered ? "2px solid #2563EB" : "2px solid transparent",
        transition: "all 0.2s ease",
      }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-border p-6 flex flex-col gap-3"
    >
      {/* Top row: category badge + live status */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${categoryStyles[project.category]}`}
        >
          {project.category}
        </span>

        {project.status === "live" && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {/* Green pulsing dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold font-heading text-foreground mt-1">
        {project.title}
      </h3>

      {/* Tagline */}
      <p className="text-sm text-muted-foreground">{project.tagline}</p>

      {/* Problem statement box
          FIX #2: "Problem:" label was invisible because shadcn's --accent CSS var
          resolves to a light/dark color that clashes with the box background.
          Using inline style with the hardcoded hex #2563EB makes it always visible. */}
      <div
        style={{
          borderLeftColor: "#2563EB",
          backgroundColor: "rgba(37,99,235,0.05)",
        }}
        className="border-l-2 px-3 py-2 rounded-r-md"
      >
        <span
          style={{ color: "#2563EB" }}
          className="text-xs font-semibold uppercase tracking-wide"
        >
          Problem:{" "}
        </span>
        <span className="text-sm text-foreground/80">{project.problem}</span>
      </div>

      {/* Tech stack badges — shadcn outline variant, max 5 shown */}
      <div className="flex flex-wrap gap-1.5 mt-1">
        {project.techStack.slice(0, 5).map((tech) => (
          <Badge key={tech} variant="outline" className="text-xs">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Action buttons — pushed to bottom with mt-auto
          FIX #3: shadcn Button default variant overrides className bg/text via CSS vars.
          Using inline style for background + color bypasses that specificity conflict. */}
      <div className="flex items-center gap-2 mt-auto pt-2">
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: "#2563EB", color: "#ffffff" }}
          className="
            inline-flex items-center gap-1.5
            px-3 py-1.5 rounded-md text-sm font-medium
            transition-all duration-150
            hover:opacity-90
          "
        >
          Live Demo
          <FiExternalLink size={14} />
        </a>

        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} GitHub repository`}
          className="
            inline-flex items-center justify-center
            px-3 py-1.5 rounded-md text-sm font-medium
            border border-border
            text-foreground
            hover:border-blue-600 hover:text-blue-600
            dark:hover:border-blue-400 dark:hover:text-blue-400
            transition-all duration-150
          "
        >
          <FiGithub size={16} />
        </a>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects by category AND search query — pure JS, no library
  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      activeFilter === "All" || p.category === activeFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchLower) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeading
          title="Featured Projects"
          subtitle="Real problems solved with real code"
        />

        {/* Filter bar + search — flex row that wraps on mobile */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category filter pills
              FIX #1: Replaced text-accent/hover:text-accent with hardcoded hex values
              so active and hover states are always visible in both light and dark mode.
              shadcn's --accent CSS var resolves differently per theme and clashes here. */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={
                  activeFilter === filter
                    ? {
                        backgroundColor: "#2563EB",
                        color: "#ffffff",
                        borderColor: "#2563EB",
                      }
                    : {}
                }
                className={`
                  px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
                  ${
                    activeFilter === filter
                      ? ""
                      : "bg-transparent border-border text-foreground hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 dark:hover:border-blue-400"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative w-full sm:max-w-xs">
            <FiSearch
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by technology or project name..."
              className="
                w-full pl-9 pr-8 py-2 text-sm
                border border-border rounded-lg
                bg-surface dark:bg-slate-900
                text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                transition
              "
            />
            {/* Clear button — only visible when there's a query */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                aria-label="Clear search"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Projects grid with stagger animation */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div
                key={`${activeFilter}-${searchQuery}`}
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </motion.div>
            ) : (
              // Empty state when filters return nothing
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center text-muted-foreground text-sm"
              >
                No projects match your search.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

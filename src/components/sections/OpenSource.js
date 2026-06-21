"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import SectionHeading from "@/components/shared/SectionHeading";

// To add future contributions: add new repository objects to the repositories array
// Each repository can have multiple contributions of any type
// The timeline renders automatically
const repositories = [
  {
    name: "hoainho/react-debugger-extension",
    description:
      "Chrome DevTools panel for React debugging: Timeline, Performance, Memory, Side Effects, Redux, CLS, AI analysis.",
    url: "https://github.com/hoainho/react-debugger-extension",
    contributions: [
      {
        type: "Documentation",
        title:
          "docs: create MCP_USAGE.md and add config snippets for Cline, Claude, and Opencode.",
        description:
          "Created the missing cli/docs/MCP_USAGE.md file to house Model Context Protocol (MCP) server integration documentation. Added valid, streamlined JSON configuration snippets for Claude Desktop, Opencode, and Cline referencing @nhonh/react-debugger@latest running the mcp subcommand.",
        pr: "#6",
        status: "Merged",
        date: "June 2026",
        url: "https://github.com/hoainho/react-debugger-extension/pull/38",
      },
      {
        type: "Bug Fix",
        title:
          "fix(cli): route bootstrap installation logs to stderr to prevent MCP stream pollution.",
        description:
          "Pivoted the installation telemetry and bootstrap text blocks inside cli/bin/cli.js from console.log to console.error. This guarantees that user-facing text messages route directly to stderr, keeping stdout completely pure for strict JSON-RPC data streaming required by Model Context Protocol (MCP) clients.",
        pr: "#49",
        status: "Merged",
        date: "June 2026",
        url: "https://github.com/hoainho/react-debugger-extension/pull/57",
      },
    ],
  },
  // Add more repositories here as you contribute to more projects
];

// Badge colors keyed by contribution type — these use fixed Tailwind palette
// colors (not theme tokens) per the spec, with dark: variants added so they
// don't wash out to white-on-white in dark mode.
const TYPE_BADGE_STYLES = {
  Documentation:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  "Bug Fix": "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  Feature:
    "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  Performance:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
};

const STATUS_BADGE_STYLES = {
  Merged:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
};

function ContributionCard({ contribution, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const typeBadgeClass =
    TYPE_BADGE_STYLES[contribution.type] ||
    "bg-secondary text-secondary-foreground";
  const statusBadgeClass =
    STATUS_BADGE_STYLES[contribution.status] ||
    "bg-secondary text-secondary-foreground";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="relative pl-12"
    >
      {/* Timeline dot */}
      <div
        className="absolute left-1.75 top-5 w-3 h-3 -translate-x-1/2 rounded-full
                   bg-portfolio-accent border-2 border-background shadow-sm z-10"
      />

      <div className="bg-card text-card-foreground border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200">
        {/* Top row: type badge + status badge + date */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeBadgeClass}`}
          >
            {contribution.type}
          </span>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusBadgeClass}`}
          >
            {contribution.status}
          </span>
          <span className="text-xs text-muted-foreground ml-auto">
            {contribution.date}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-medium text-base mt-3 text-foreground leading-snug">
          {contribution.title}
        </h4>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
          {contribution.description}
        </p>

        {/* PR link */}
        <a
          href={contribution.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm mt-3 hover:underline text-portfolio-accent"
        >
          <FiGithub className="w-3.5 h-3.5" />
          {contribution.pr}
        </a>
      </div>
    </motion.div>
  );
}

function RepositoryBlock({ repo, repoIndex }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5, delay: repoIndex * 0.1 }}
      className="mb-12 last:mb-0"
    >
      {/* Repository header card */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <FiGithub className="w-5 h-5 mt-1 shrink-0 text-foreground" />
            <div>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-lg font-heading text-foreground hover:underline"
              >
                {repo.name}
              </a>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1.5 max-w-xl">
                {repo.description}
              </p>
            </div>
          </div>

          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm shrink-0 hover:underline text-portfolio-accent"
          >
            View Repository
            <FiExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Contribution timeline */}
      <div className="relative mt-6">
        <div className="absolute left-1.75 top-2 bottom-2 w-0.5 bg-portfolio-accent/25" />

        <div className="space-y-5">
          {repo.contributions.map((contribution, i) => (
            <ContributionCard
              key={contribution.pr}
              contribution={contribution}
              index={i}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function OpenSource() {
  return (
    <section id="opensource" className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Open Source Contributions"
          subtitle="Giving back to the community"
        />

        <div className="mt-12">
          {repositories.map((repo, index) => (
            <RepositoryBlock key={repo.name} repo={repo} repoIndex={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

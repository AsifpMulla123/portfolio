"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiArrowDown,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";

// Roles that cycle in the animated text below the heading
const ROLES = [
  "Full Stack Developer",
  "MERN Stack Engineer",
  "Next.js Specialist",
  "Open Source Contributor",
];

// Each line in the fake code block with its syntax highlight type
const CODE_LINES = [
  {
    tokens: [
      { text: "import ", type: "keyword" },
      { text: "connectDB ", type: "default" },
      { text: "from ", type: "keyword" },
      { text: "'@/lib/db/mongodb'", type: "string" },
    ],
  },
  {
    tokens: [
      { text: "import ", type: "keyword" },
      { text: "Project ", type: "default" },
      { text: "from ", type: "keyword" },
      { text: "'@/lib/db/models/Project'", type: "string" },
    ],
  },
  { tokens: [] }, // blank line
  {
    tokens: [
      { text: "export ", type: "keyword" },
      { text: "const ", type: "keyword" },
      { text: "dynamic ", type: "default" },
      { text: "= ", type: "default" },
      { text: "'force-static'", type: "string" },
    ],
  },
  { tokens: [] }, // blank line
  {
    tokens: [
      { text: "export ", type: "keyword" },
      { text: "async ", type: "keyword" },
      { text: "function ", type: "keyword" },
      { text: "GET", type: "fn" },
      { text: "() {", type: "default" },
    ],
  },
  {
    tokens: [
      { text: "  ", type: "default" },
      { text: "await ", type: "keyword" },
      { text: "connectDB", type: "fn" },
      { text: "()", type: "default" },
    ],
  },
  { tokens: [] }, // blank line
  {
    tokens: [
      { text: "  ", type: "default" },
      { text: "const ", type: "keyword" },
      { text: "projects ", type: "default" },
      { text: "= ", type: "default" },
      { text: "await ", type: "keyword" },
      { text: "Project", type: "fn" },
    ],
  },
  {
    tokens: [
      { text: "    .", type: "default" },
      { text: "find", type: "fn" },
      { text: "({ status: { ", type: "default" },
      { text: "$ne", type: "keyword" },
      { text: ": ", type: "default" },
      { text: "'archived'", type: "string" },
      { text: " } })", type: "default" },
    ],
  },
  {
    tokens: [
      { text: "    .", type: "default" },
      { text: "sort", type: "fn" },
      { text: "({ order: ", type: "default" },
      { text: "1", type: "string" },
      { text: " })", type: "default" },
    ],
  },
  {
    tokens: [
      { text: "    .", type: "default" },
      { text: "select", type: "fn" },
      { text: "(", type: "default" },
      { text: "'-__v'", type: "string" },
      { text: ")", type: "default" },
    ],
  },
  { tokens: [] }, // blank line
  {
    tokens: [
      { text: "  ", type: "default" },
      { text: "return ", type: "keyword" },
      { text: "Response.", type: "default" },
      { text: "json", type: "fn" },
      { text: "({", type: "default" },
    ],
  },
  {
    tokens: [
      { text: "    success: ", type: "default" },
      { text: "true", type: "keyword" },
      { text: ",", type: "default" },
    ],
  },
  { tokens: [{ text: "    data: projects", type: "default" }] },
  { tokens: [{ text: "  })", type: "default" }] },
  { tokens: [{ text: "}", type: "default" }] },
];

// Maps a token type to its Tailwind text color class
function tokenColor(type) {
  switch (type) {
    case "keyword":
      return "text-[#2563EB]"; // accent blue
    case "string":
      return "text-[#10B981]"; // success green
    case "fn":
      return "text-white";
    case "comment":
      return "text-[#64748B]"; // muted
    default:
      return "text-[#CBD5E1]"; // near-white for default code text
  }
}

// Framer Motion variants — used for staggered left-column entrance
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const rightVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};

export default function Hero() {
  // Index of the currently displayed role in the cycling animation
  const [roleIndex, setRoleIndex] = useState(0);
  // Controls whether the role text is visible (for fade transition)
  const [roleVisible, setRoleVisible] = useState(true);

  useEffect(() => {
    // Every 3 seconds: fade out → switch text → fade in
    const interval = setInterval(() => {
      // Step 1: fade out
      setRoleVisible(false);

      // Step 2: after 300ms (matching CSS transition), update text and fade in
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        setRoleVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-center">
          {/* ─── LEFT COLUMN ─────────────────────────────────── */}
          <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* 1. Availability badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-sm font-medium text-[#10B981]">
                {/* Pulsing green dot */}
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                Available for Full-time Roles
              </span>
            </motion.div>

            {/* 2. Main H1 heading */}
            <motion.h1
              variants={itemVariants}
              className="font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#0A0A0A] dark:text-white"
              style={{ fontFamily: "var(--font-ibm-plex-sans), sans-serif" }}
            >
              Building Scalable Web Applications
            </motion.h1>

            {/* 3. Animated cycling role text */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#64748B]"
            >
              I am a{" "}
              <span
                className="font-medium text-[#2563EB] transition-opacity duration-300"
                style={{ opacity: roleVisible ? 1 : 0 }}
              >
                {ROLES[roleIndex]}
              </span>
            </motion.p>

            {/* 4. Bio paragraph */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-[#64748B] leading-relaxed max-w-lg"
            >
              I'm Asif, a Full Stack Developer with a passion for building
              products that solve real problems. I specialize in the MERN stack,
              Next.js, and cloud integrations — focused on clean code, fast
              performance, and great user experiences.
            </motion.p>

            {/* 5. CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 sm:flex-row flex-col"
            >
              {/* Primary: scroll to projects */}
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#2563EB] text-white font-medium text-sm hover:bg-[#1D4ED8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              >
                View My Work
                <FiArrowDown size={16} />
              </a>

              {/* Secondary: download resume */}
              <a
                href="/resume/resume.pdf"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#E2E8F0] text-[#0A0A0A] dark:text-white dark:border-white/20 font-medium text-sm hover:border-[#2563EB] hover:text-[#2563EB] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
              >
                Download Resume
                <FiDownload size={16} />
              </a>
            </motion.div>

            {/* 6. Social icon row */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4"
            >
              <a
                href="https://github.com/asif-dev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-[#64748B] hover:text-[#2563EB] transition-colors"
              >
                <FiGithub size={20} />
              </a>
              <a
                href="https://linkedin.com/in/asif-dev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#64748B] hover:text-[#2563EB] transition-colors"
              >
                <FiLinkedin size={20} />
              </a>
              <a
                href="https://twitter.com/asif-dev"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[#64748B] hover:text-[#2563EB] transition-colors"
              >
                <FiTwitter size={20} />
              </a>
            </motion.div>
          </motion.div>

          {/* ─── RIGHT COLUMN — animated code card ──────────── */}
          <motion.div
            className="relative"
            variants={rightVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Dot grid background decoration — sits behind the card */}
            <div className="dot-grid absolute inset-0 -z-10 rounded-2xl opacity-50" />

            {/* Floating code card */}
            <div
              className="animate-float relative rounded-xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden"
              style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
            >
              {/* Window chrome: three dots + file tab */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#111111]">
                {/* Decorative traffic-light dots */}
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />

                {/* File name tab */}
                <span className="ml-2 text-xs text-[#64748B] bg-white/5 px-3 py-0.5 rounded-md">
                  api/projects/route.js
                </span>
              </div>

              {/* Code body */}
              <div className="p-5 text-sm leading-6 overflow-x-auto">
                {CODE_LINES.map((line, lineIdx) => (
                  <div key={lineIdx} className="flex">
                    {/* Line number */}
                    <span className="select-none w-8 text-right pr-4 text-[#334155] text-xs shrink-0 pt-px">
                      {lineIdx + 1}
                    </span>

                    {/* Tokens or blank line */}
                    <span>
                      {line.tokens.length === 0 ? (
                        // Blank lines need at least a space so the div has height
                        <>&nbsp;</>
                      ) : (
                        line.tokens.map((token, tokenIdx) => (
                          <span
                            key={tokenIdx}
                            className={tokenColor(token.type)}
                          >
                            {token.text}
                          </span>
                        ))
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

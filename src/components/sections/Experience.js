"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FiBriefcase, FiMapPin, FiCalendar, FiCheck } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import SectionHeading from "@/components/shared/SectionHeading";

// To add more experience entries, simply add objects to the experiences array below.
// The timeline renders automatically for however many entries exist.
const experiences = [
  {
    company: "Gray Material",
    role: "Full Stack Developer",
    type: "Full-time",
    startDate: "September 2024",
    endDate: "September 2025",
    location: "Hybrid, India",
    description:
      "Working on the core product team building and maintaining full-stack features for Batteryfy.com — an energy solutions platform. Responsible for frontend development, REST API design, and cloud integrations.",
    achievements: [
      "Built 3 production features using Next.js and Node.js, improving page load speed by 35%",
      "Designed and maintained REST APIs handling thousands of monthly requests with consistent uptime",
      "Integrated AWS S3 for media storage, reducing third-party storage costs significantly",
      "Implemented JWT-based authentication across protected routes, eliminating unauthorized access issues",
      "Collaborated in daily standups and sprint planning using Jira, following Agile methodology",
      "Reviewed pull requests and wrote documentation improving team onboarding speed",
    ],
    techStack: [
      "React",
      "Tailwind CSS",
      "Firebase",
      "Next.js",
      "Node.js",
      "MongoDB",
      "Vercel",
      "JWT",
    ],
  },
];

// The timeline line that animates as the section comes into view.
// Track and dot share the same left offset (left-[7px]) so the 2px line
// sits dead-center under the 16px (w-4) dot.
function TimelineLine() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="absolute left-1.75 top-0 bottom-0 w-0.5 overflow-hidden"
    >
      {/* Static background line — uses border token, visible in both themes */}
      <div className="absolute inset-0 bg-border" />
      {/* Animated fill line — portfolio accent token */}
      <motion.div
        className="absolute inset-0 origin-top bg-portfolio-accent"
        style={{ scaleY }}
      />
    </div>
  );
}

function ExperienceCard({ experience, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="relative pl-12"
    >
      {/* Timeline dot — left-[7px] matches the line's left offset exactly,
          -translate-x-1/2 centers the 16px dot on that point */}
      <div
        className="absolute left-1.75 top-7 w-4 h-4 -translate-x-1/2 rounded-full
                   bg-portfolio-accent border-2 border-background shadow-md z-10"
      />

      {/* Experience card */}
      <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-200">
        {/* Row 1: Role + Duration badge */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-bold text-xl font-heading leading-tight">
            {experience.role}
          </h3>
          <span className="text-sm font-medium px-3 py-1 rounded-full shrink-0 bg-portfolio-accent-light text-portfolio-accent dark:bg-portfolio-accent/15 dark:text-portfolio-accent">
            {experience.startDate} – {experience.endDate}
          </span>
        </div>

        {/* Row 2: Company + type */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5">
            <FiBriefcase className="w-4 h-4 shrink-0 text-portfolio-accent" />
            <span className="font-medium text-portfolio-accent">
              {experience.company}
            </span>
          </div>
          <Badge variant="outline" className="text-xs">
            {experience.type}
          </Badge>
        </div>

        {/* Row 3: Location + Calendar */}
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <FiMapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{experience.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiCalendar className="w-3.5 h-3.5 shrink-0" />
            <span>
              {experience.startDate} – {experience.endDate}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
          {experience.description}
        </p>

        {/* Key Achievements — text-foreground flips correctly in dark mode,
            this was previously hardcoded and stayed white-on-white */}
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-portfolio-accent">
            Key Achievements
          </p>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
              >
                <FiCheck className="w-4 h-4 mt-0.5 shrink-0 text-portfolio-success" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border">
          {experience.techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs font-mono">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Work Experience"
          subtitle="Where I've built things that matter"
        />

        <div className="relative mt-12">
          <TimelineLine />

          <div className="space-y-10">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={`${experience.company}-${index}`}
                experience={experience}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

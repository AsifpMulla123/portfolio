"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiGlobe,
  FiCode,
  FiCloud,
  FiZap,
} from "react-icons/fi";
import SectionHeading from "@/components/shared/SectionHeading";

// Quick facts shown below the avatar
const QUICK_FACTS = [
  { icon: FiMapPin, label: "Location", value: "India" },
  { icon: FiBriefcase, label: "Open to", value: "Remote & Hybrid" },
  { icon: FiClock, label: "Response", value: "Within 24 hours" },
  { icon: FiGlobe, label: "Languages", value: "English, Hindi" },
];

// Three service cards shown below the bio
const SERVICES = [
  {
    icon: FiCode,
    title: "Full Stack Development",
    description:
      "End-to-end web applications using React, Node.js, and MongoDB with focus on scalability and performance.",
  },
  {
    icon: FiCloud,
    title: "Cloud Integration",
    description:
      "AWS services, serverless functions, S3 storage, and scalable cloud deployments for production applications.",
  },
  {
    icon: FiZap,
    title: "Performance Engineering",
    description:
      "Core Web Vitals optimization, smart caching strategies, and fast user interfaces that score 90+ on Lighthouse.",
  },
];

// Framer Motion variants for the overall section entrance
const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Stagger for the three service cards
const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export default function About() {
  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] dark:bg-[#0F172A]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-start">
          {/* ─── LEFT COLUMN — avatar + quick facts ──────────── */}
          <motion.div
            className="flex flex-col items-center lg:items-start gap-8"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Avatar container */}
            <motion.div variants={fadeUp} className="relative inline-block">
              {/* Circular profile photo */}
              {/* Image is loaded from /public/images/profile.webp */}
              {/* ring-4 gives the accent blue border ring around the circle */}
              <div className="w-48 h-48 rounded-full ring-4 ring-[#2563EB]/30 overflow-hidden relative">
                <Image
                  src="/images/profile.webp"
                  alt="Asif — Full Stack Developer"
                  fill
                  // object-cover ensures the photo fills the circle without stretching
                  className="object-cover object-top"
                  // priority loads this image eagerly since it is above the fold
                  priority
                  sizes="192px"
                />
              </div>

              {/* Online / available indicator badge */}
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-white/10 rounded-full px-2.5 py-1 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs font-medium text-[#10B981]">
                  Available
                </span>
              </div>
            </motion.div>

            {/* Quick facts list */}
            <motion.ul
              variants={fadeUp}
              className="flex flex-col gap-3 w-full max-w-xs"
            >
              {QUICK_FACTS.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-center gap-3">
                  {/* Icon container */}
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                    <Icon size={15} />
                  </span>
                  <span className="text-sm text-[#64748B]">
                    <span className="font-medium text-[#0A0A0A] dark:text-white">
                      {label}:
                    </span>{" "}
                    {value}
                  </span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ─── RIGHT COLUMN — heading, bio, service cards ──── */}
          <motion.div
            className="flex flex-col gap-6"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Section heading — left-aligned */}
            <motion.div variants={fadeUp}>
              <SectionHeading title="About Me" align="left" />
            </motion.div>

            {/* Bio paragraph 1 */}
            <motion.p
              variants={fadeUp}
              className="text-[#64748B] leading-relaxed text-base"
            >
              I'm a Full Stack Developer with over a year of professional
              experience building production web applications. My primary stack
              is MERN (MongoDB, Express, React, Node.js) alongside Next.js for
              full-stack development. I enjoy turning complex problems into
              simple, elegant solutions.
            </motion.p>

            {/* Bio paragraph 2 */}
            <motion.p
              variants={fadeUp}
              className="text-[#64748B] leading-relaxed text-base"
            >
              Outside of work, I actively contribute to open source projects and
              solve Data Structures &amp; Algorithms problems in C++. I hold
              certifications from AWS, MongoDB, Google, Meta, and Atlassian. I'm
              currently seeking full-time opportunities where I can grow
              alongside a strong engineering team.
            </motion.p>

            {/* Service cards — horizontal scroll on mobile, 3-col grid on desktop */}
            <motion.div
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="
                mt-2
                grid grid-cols-1 sm:grid-cols-3 gap-4
                overflow-x-auto sm:overflow-visible
                pb-2 sm:pb-0
              "
            >
              {SERVICES.map(({ icon: Icon, title, description }) => (
                <motion.div
                  key={title}
                  variants={cardVariants}
                  className="
                    group
                    flex flex-col gap-3
                    bg-white dark:bg-[#1E293B]
                    border border-[#E2E8F0] dark:border-white/10
                    rounded-xl p-5
                    hover:shadow-md hover:border-[#2563EB]/30
                    transition-all duration-200
                    min-w-55 sm:min-w-0
                  "
                >
                  {/* Icon container */}
                  <span className="w-9 h-9 rounded-lg bg-[#EFF6FF] dark:bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] shrink-0">
                    <Icon size={18} />
                  </span>

                  {/* Card title */}
                  <h3 className="font-semibold text-sm text-[#0A0A0A] dark:text-white leading-snug">
                    {title}
                  </h3>

                  {/* Card description */}
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

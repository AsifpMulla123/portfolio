"use client";

// SectionHeading — reusable heading used by every section on the page.
// Props:
//   label    — small uppercase eyebrow text (accent blue)
//   title    — main H2 text
//   subtitle — optional muted description below the title
//   align    — 'center' (default) | 'left'

import { motion } from "framer-motion";

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = "center",
}) {
  const isCenter = align === "center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`mb-12 ${isCenter ? "text-center" : "text-left"}`}
    >
      {/* Eyebrow label */}
      {label && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
          {label}
        </p>
      )}

      {/* Main section title */}
      <h2
        className="text-3xl font-bold text-[#0A0A0A] dark:text-[#F5F5F5] sm:text-4xl"
        style={{
          fontFamily: 'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
        }}
      >
        {title}
      </h2>

      {/* Optional subtitle */}
      {subtitle && (
        <p
          className={`mt-3 text-base text-[#64748B] dark:text-[#94A3B8] max-w-xl leading-relaxed ${
            isCenter ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { SiAtlassian, SiMongodb, SiMeta } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import SectionHeading from "@/components/shared/SectionHeading";

const certifications = [
  {
    name: "Introduction to Information Technology and AWS Cloud",
    issuer: "Amazon Web Services",
    platform: "Coursera",
    year: "2026",
    icon: FaAws,
    iconColor: "#FF9900",
    verifyUrl:
      "https://www.coursera.org/account/accomplishments/verify/0RPC2Y0XCZID",
  },
  {
    name: "Introduction to Front-End Development",
    issuer: "Meta",
    platform: "Coursera",
    year: "2026",
    icon: SiMeta,
    iconColor: "#0081FB",
    verifyUrl:
      "https://www.coursera.org/account/accomplishments/verify/OZ3A3ABFWMI3",
  },
  {
    name: "Introduction to Git and GitHub",
    issuer: "Google",
    platform: "Coursera",
    year: "2024",
    icon: FcGoogle,
    iconColor: "#4285F4",
    verifyUrl:
      "https://www.coursera.org/account/accomplishments/verify/784EZXA6XY7G",
  },
  {
    name: "Get started with Jira",
    issuer: "Atlassian",
    platform: "Coursera",
    year: "2024",
    icon: SiAtlassian,
    iconColor: "#0052CC",
    verifyUrl:
      "https://www.coursera.org/account/accomplishments/verify/GBMPCK3CBTRG",
  },
  //   {
  //     name: "MongoDB Developer Path",
  //     issuer: "MongoDB University",
  //     platform: "MongoDB University",
  //     year: "2024",
  //     icon: SiMongodb,
  //     iconColor: "#47A248",
  //     verifyUrl: "https://university.mongodb.com/verify/dummy-cert-003",
  //   },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function CertificationCard({ cert }) {
  const Icon = cert.icon;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative bg-card text-card-foreground border border-border rounded-2xl p-5
                 shadow-card hover:shadow-card-hover transition-all duration-200
                 hover:-translate-y-1
                 border-t-2 border-t-transparent hover:border-t-portfolio-accent"
    >
      {/* Top row: issuer icon + year */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${cert.iconColor}1A` }}
          // Brand icon colors are intentionally kept as literal hex — these are
          // fixed third-party brand colors (Google blue, AWS orange, etc.),
          // not theme colors, so they stay constant across light/dark mode.
        >
          <Icon size={22} style={{ color: cert.iconColor }} />
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {cert.year}
        </span>
      </div>

      {/* Cert name */}
      <h3 className="font-bold text-lg font-heading mt-3 leading-snug text-foreground">
        {cert.name}
      </h3>

      {/* Issuer + platform */}
      <p className="text-sm text-muted-foreground mt-1">
        Issued by {cert.issuer} via {cert.platform}
      </p>

      {/* Verify link */}
      <a
        href={cert.verifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm mt-4 hover:underline transition-colors duration-150 text-portfolio-accent"
      >
        Verify Certificate
        <FiExternalLink className="w-3.5 h-3.5" />
      </a>
    </motion.div>
  );
}

export default function Certifications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="certifications"
      className="py-20 bg-portfolio-surface dark:bg-card"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Certifications"
          subtitle="Verified credentials from industry leaders"
        />

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {certifications.map((cert) => (
            <CertificationCard key={cert.name} cert={cert} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

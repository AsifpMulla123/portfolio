"use client";

import { motion } from "framer-motion";
import { FiMessageCircle, FiTarget, FiBookOpen } from "react-icons/fi";
import SectionHeading from "@/components/shared/SectionHeading";

// This section will be replaced with real testimonials once you receive
// LinkedIn recommendations or client feedback. Simply swap the data array.
const workingStyle = [
  {
    icon: FiMessageCircle,
    title: "Clear Communication",
    description:
      "I document decisions, write clear commit messages, and keep stakeholders updated throughout the project. No surprises, no ambiguity.",
    trait: "Communicator",
  },
  {
    icon: FiTarget,
    title: "Deadline Driven",
    description:
      "I break down tasks, estimate realistically, and flag blockers early. Shipping on time is a habit built through planning — not luck.",
    trait: "Reliable",
  },
  {
    icon: FiBookOpen,
    title: "Always Learning",
    description:
      "I read documentation, not just Stack Overflow. I understand what I build, question why things work, and keep up with the ecosystem.",
    trait: "Growth Mindset",
  },
];

// Animation variants for the staggered grid entrance
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function WorkingStyle() {
  return (
    <section
      id="working-style"
      className="bg-portfolio-surface dark:bg-card py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="How I Work"
          subtitle="Principles I bring to every project and team"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {workingStyle.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                className="group relative bg-card text-foreground border border-border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-card-hover overflow-hidden"
              >
                {/* Trait badge */}
                <span className="inline-block bg-portfolio-accent/10 text-portfolio-accent rounded-full px-3 py-1 text-xs uppercase tracking-wide font-medium">
                  {item.trait}
                </span>

                {/* Icon container */}
                <div className="bg-portfolio-accent/10 w-12 h-12 rounded-xl flex items-center justify-center mt-4">
                  <Icon className="text-portfolio-accent" size={24} />
                </div>

                {/* Title */}
                <h3 className="font-heading font-bold text-xl mt-4 text-foreground">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mt-2">
                  {item.description}
                </p>

                {/* Animated bottom border on hover */}
                <span className="absolute bottom-0 left-0 h-1 w-full bg-portfolio-accent scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

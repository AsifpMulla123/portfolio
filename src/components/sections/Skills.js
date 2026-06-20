"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SectionHeading from "@/components/shared/SectionHeading";

// Si icons from react-icons/si
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiHtml5,
  SiTailwindcss,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiJsonwebtokens,
  SiCplusplus,
  SiGit,
  SiOpenai,
  SiDocker,
  SiGithub,
  SiPostman,
} from "react-icons/si";
import { FaAws, FaCss3 } from "react-icons/fa";
import { VscVscode, VscSymbolMisc } from "react-icons/vsc";
import { TbApi, TbBinaryTree } from "react-icons/tb";

// Skills data — one place to update if stack changes
// Icons with color '#FFFFFF' are white-on-dark icons (Next.js, Express, GitHub).
// They need special treatment: black in light mode, white in dark mode.
const skillsData = {
  Frontend: [
    { name: "React.js", icon: SiReact, color: "#61DAFB", whiteIcon: false },
    { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF", whiteIcon: true },
    {
      name: "JavaScript",
      icon: SiJavascript,
      color: "#F7DF1E",
      whiteIcon: false,
    },
    { name: "HTML5", icon: SiHtml5, color: "#E34F26", whiteIcon: false },
    { name: "CSS3", icon: FaCss3, color: "#1572B6", whiteIcon: false },
    {
      name: "Tailwind CSS",
      icon: SiTailwindcss,
      color: "#06B6D4",
      whiteIcon: false,
    },
    {
      name: "Redux Toolkit",
      icon: SiRedux,
      color: "#764ABC",
      whiteIcon: false,
    },
  ],
  Backend: [
    { name: "Node.js", icon: SiNodedotjs, color: "#339933", whiteIcon: false },
    { name: "Express.js", icon: SiExpress, color: "#FFFFFF", whiteIcon: true },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248", whiteIcon: false },
    { name: "REST APIs", icon: TbApi, color: "#2563EB", whiteIcon: false },
    {
      name: "JWT Auth",
      icon: SiJsonwebtokens,
      color: "#eb5424",
      whiteIcon: false,
    },
  ],
  "Languages & DSA": [
    { name: "C++", icon: SiCplusplus, color: "#00599C", whiteIcon: false },
    {
      name: "Data Structures",
      icon: TbBinaryTree,
      color: "#2563EB",
      whiteIcon: false,
    },
    {
      name: "Algorithms",
      icon: VscSymbolMisc,
      color: "#2563EB",
      whiteIcon: false,
    },
    { name: "Git", icon: SiGit, color: "#F05032", whiteIcon: false },
  ],
  "Cloud & Tools": [
    { name: "AWS", icon: FaAws, color: "#FF9900", whiteIcon: false },
    {
      name: "Prompt Engineering",
      icon: SiOpenai,
      color: "#412991",
      whiteIcon: false,
    },
    { name: "Docker", icon: SiDocker, color: "#2496ED", whiteIcon: false },
    { name: "GitHub", icon: SiGithub, color: "#FFFFFF", whiteIcon: true },
    { name: "VS Code", icon: VscVscode, color: "#007ACC", whiteIcon: false },
    { name: "Postman", icon: SiPostman, color: "#FF6C37", whiteIcon: false },
  ],
};

const tabKeys = Object.keys(skillsData);

// Grid container staggers children cards in
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// Each card animates up from y:20
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

// Individual skill card — isolated so hover state is per-card
function SkillCard({ skill }) {
  const [hovered, setHovered] = useState(false);
  const Icon = skill.icon;

  const iconStyle = skill.whiteIcon
    ? {
        // currentColor lets the Tailwind text class control the icon color
        color: "currentColor",
        opacity: hovered ? 1 : 0.75,
        transition: "opacity 0.2s ease",
      }
    : {
        color: skill.color,
        opacity: hovered ? 1 : 0.8,
        transition: "opacity 0.2s ease",
      };

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? "0 4px 24px 0 rgba(37, 99, 235, 0.18)"
          : "0 1px 3px 0 rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        borderColor: hovered ? "#2563EB" : undefined,
        transition: "all 0.2s ease",
      }}
      className="flex flex-col items-center justify-center bg-white dark:bg-slate-800/50 rounded-xl border border-border p-4 cursor-default"
    >
      {/* whiteIcon wrapper: text-gray-900 in light mode, text-white in dark mode
          This controls the 'currentColor' of the icon via Tailwind's dark: variant */}
      <span
        className={
          skill.whiteIcon ? "text-gray-900 dark:text-white" : undefined
        }
      >
        <Icon size={40} style={iconStyle} aria-hidden="true" />
      </span>

      <span className="text-sm font-medium text-center mt-2 text-foreground">
        {skill.name}
      </span>
    </motion.div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState("Frontend");

  return (
    <section id="skills" className="py-20 bg-surface">
      <div className="container mx-auto px-4 max-w-6xl">
        <SectionHeading
          title="Technical Skills"
          subtitle="Technologies I work with"
        />

        <div className="mt-12">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList
              className="
                flex flex-wrap gap-1
                bg-transparent border border-border
                rounded-xl p-1
                w-full sm:w-auto sm:inline-flex
                mb-8
              "
            >
              {tabKeys.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  style={
                    activeTab === tab
                      ? {
                          color: "#2563EB",
                          backgroundColor: "rgba(37,99,235,0.07)",
                          borderBottom: "2px solid #2563EB",
                          boxShadow: "none",
                        }
                      : {}
                  }
                  className="
                    rounded-lg px-4 py-2 text-sm font-medium
                    text-muted-foreground
                    transition-all duration-200
                  "
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab content panels — AnimatePresence so exit animation plays */}
            {tabKeys.map((tab) => (
              <TabsContent key={tab} value={tab} forceMount>
                <AnimatePresence mode="wait">
                  {activeTab === tab && (
                    <motion.div
                      key={tab}
                      variants={gridVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                      {skillsData[tab].map((skill) => (
                        <SkillCard key={skill.name} skill={skill} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}

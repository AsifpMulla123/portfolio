"use client";

// src/components/shared/ThemeToggle.js
// Uses mounted state to prevent SSR/client hydration mismatch.
// The server has no concept of the user's theme preference, so we
// render nothing on the server and only show the toggle after hydration.

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/components/shared/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // mounted prevents server/client mismatch — server doesn't know
  // the user's theme so we skip rendering the icon until after hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Render a same-size placeholder on the server so layout doesn't shift
  if (!mounted) {
    return <div className="w-8 h-8" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-8 h-8 flex items-center justify-center text-[#64748B] hover:text-[#2563EB] dark:text-[#94A3B8] dark:hover:text-[#2563EB] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <FiSun size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <FiMoon size={18} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

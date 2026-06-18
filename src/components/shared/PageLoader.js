"use client";

// PageLoader — shows a branded splash for 1.2 s on the user's first visit.
// sessionStorage prevents it from showing again during the same browser session.
// Framer Motion handles both the internal animation and the exit fade-out.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function PageLoader() {
  // null = "haven't decided yet" — avoids a flash of the loader on repeat visits
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("loader_shown");

    if (alreadyShown) {
      // Skip the loader entirely; page content shows immediately
      setVisible(false);
      return;
    }

    // First visit — show the loader
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      // Mark as shown so subsequent navigations skip it
      sessionStorage.setItem("loader_shown", "true");
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Render nothing until we know whether to show
  if (visible === null) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0A]"
          aria-hidden="true"
        >
          {/* Brand name */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight text-[#0A0A0A] dark:text-[#F5F5F5]"
            style={{
              fontFamily:
                'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
            }}
          >
            Asif
            {/* The accent dot is the signature mark */}
            <span className="text-[#2563EB]">.</span>
          </motion.p>

          {/* Animated underline that sweeps left → right */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
            style={{ originX: 0 }}
            className="mt-3 block h-0.5 w-16 bg-[#2563EB] rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

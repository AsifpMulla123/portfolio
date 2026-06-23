"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiZap } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConnectModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const alreadyDismissed = sessionStorage.getItem("modal_dismissed");
    const alreadyContacted = sessionStorage.getItem("contact_submitted");
    const isMobile = window.innerWidth <= 768;

    // Never show on mobile or if already handled this session
    if (alreadyDismissed || alreadyContacted || isMobile) return;

    // Guard flag — ensures timer and exit intent can't both fire the modal
    let shown = false;

    const showModal = () => {
      if (shown) return;
      shown = true;
      // Clean up both triggers the moment we decide to show
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleExitIntent);
      setIsOpen(true);
    };

    // Exit intent: mouse leaves viewport through the top edge
    const handleExitIntent = (e) => {
      if (e.clientY < 10) {
        showModal();
      }
    };

    const timer = setTimeout(showModal, 10000);
    document.addEventListener("mouseleave", handleExitIntent);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleExitIntent);
    };
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("modal_dismissed", "true");
    setIsOpen(false);
  };

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    // Dismiss after navigating — no need to see it again this session
    handleDismiss();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      {/*
        [&>button]:w-10 etc. — makes the default shadcn close button
        larger without adding a second close button on top of it.
        The default button is always last-child inside DialogContent.
      */}
      <DialogContent className="max-w-md p-8 [&>button]:w-10 [&>button]:h-10 [&>button]:top-3 [&>button]:right-3 [&>button>svg]:w-5 [&>button>svg]:h-5">
        {/*
          Radix requires DialogTitle inside DialogContent for screen readers.
          We use the actual heading text here — no need for VisuallyHidden
          since the heading is visible content anyway.
        */}
        <DialogTitle className="sr-only">
          Let&apos;s Build Something Together
        </DialogTitle>

        {/*
          DialogDescription satisfies the aria-describedby warning.
          Hidden visually because the subtext is rendered below.
        */}
        <DialogDescription className="sr-only">
          Open to full-time roles, freelance projects, and interesting
          collaborations. Use the buttons below to get in touch or view work.
        </DialogDescription>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-portfolio-accent-light flex items-center justify-center">
                <FiZap className="w-7 h-7 text-portfolio-accent" />
              </div>

              <h3 className="font-heading text-xl font-bold text-foreground">
                Let&apos;s Build Something Together
              </h3>

              <p className="text-muted-foreground text-sm">
                Open to full-time roles, freelance projects, and interesting
                collaborations
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <Button
                  onClick={() => scrollToSection("#contact")}
                  className="flex-1 text-white"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  Send a Message
                </Button>
                <Button
                  onClick={() => scrollToSection("#projects")}
                  variant="outline"
                  className="flex-1"
                  style={{ borderColor: "#2563EB", color: "#2563EB" }}
                >
                  View My Work
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-1">
                You can dismiss this and find the contact form at the bottom of
                the page.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

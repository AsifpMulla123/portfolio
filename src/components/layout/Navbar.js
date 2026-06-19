"use client";

// Navbar — fixed top navigation.
// - Transparent before 80 px scroll, frosted glass after.
// - Active section highlighted via IntersectionObserver.
// - Mobile: shadcn Sheet slides in from the right.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/shared/ThemeToggle";
import ScrollToTop from "@/components/layout/ScrollToTop";

// ─── Nav Links ────────────────────────────────────────────────────────
// Each 'id' must match the section's id attribute on the homepage
const NAV_LINKS = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Blog", id: "blog" },
  { label: "Contact", id: "contact" },
];

const SOCIALS = [
  { icon: FiGithub, href: "https://github.com/asif-dev", label: "GitHub" },
  {
    icon: FiLinkedin,
    href: "https://linkedin.com/in/asif-dev",
    label: "LinkedIn",
  },
  { icon: FiTwitter, href: "https://twitter.com/asif-dev", label: "Twitter" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const observersRef = useRef([]);

  // ─── Scroll-aware background ──────────────────────────────────────
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── Active section detection via IntersectionObserver ────────────
  useEffect(() => {
    // Disconnect any existing observers before setting up new ones
    observersRef.current.forEach((obs) => obs.disconnect());
    observersRef.current = [];

    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      // Fire when at least 40% of the section is in view
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { threshold: 0.4 },
      );

      observer.observe(el);
      observersRef.current.push(observer);
    });

    return () => {
      observersRef.current.forEach((obs) => obs.disconnect());
    };
  }, []);

  // ─── Smooth scroll helper ─────────────────────────────────────────
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      // Offset by navbar height (64px) so the section title is not hidden
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setSheetOpen(false);
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#1E293B]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ── Logo ──────────────────────────────────────────── */}
            <Link
              href="/"
              className="text-xl font-bold text-[#0A0A0A] dark:text-[#F5F5F5] hover:opacity-80 transition-opacity"
              style={{
                fontFamily:
                  'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
              }}
            >
              Asif<span className="text-[#2563EB]">.</span>
            </Link>

            {/* ── Desktop Nav ───────────────────────────────────── */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    activeId === id
                      ? "text-[#2563EB]"
                      : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* ── Right Controls ────────────────────────────────── */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Hire Me — desktop only */}
              <button
                onClick={() => scrollToSection("contact")}
                className="hidden md:inline-flex items-center px-4 py-1.5 rounded-md border border-[#2563EB] text-[#2563EB] text-sm font-medium hover:bg-[#2563EB] hover:text-white transition-colors duration-200"
              >
                Hire Me
              </button>

              {/* Mobile menu trigger */}
              <div className="md:hidden">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <button
                      aria-label={sheetOpen ? "Close menu" : "Open menu"}
                      className="p-2 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5] transition-colors"
                    >
                      {sheetOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                  </SheetTrigger>

                  <SheetContent
                    side="right"
                    className="w-72 bg-white dark:bg-[#0A0A0A] border-[#E2E8F0] dark:border-[#1E293B] p-0"
                  >
                    {/*
                      Radix UI requires SheetTitle + SheetDescription to exist in
                      the DOM for screen reader accessibility.
                      We hide them visually since the Navbar logo already serves
                      as the visible heading inside the sheet.
                    */}
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">
                      Main navigation links for the portfolio site.
                    </SheetDescription>

                    {/* Mobile sheet inner content */}
                    <div className="flex flex-col h-full px-6 py-8">
                      {/* Logo inside sheet */}
                      <p
                        className="text-xl font-bold text-[#0A0A0A] dark:text-[#F5F5F5] mb-8"
                        style={{
                          fontFamily:
                            'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
                        }}
                      >
                        Asif<span className="text-[#2563EB]">.</span>
                      </p>

                      {/* Mobile nav links */}
                      <nav
                        className="flex flex-col gap-1"
                        aria-label="Mobile navigation"
                      >
                        {NAV_LINKS.map(({ label, id }) => (
                          <button
                            key={id}
                            onClick={() => scrollToSection(id)}
                            className={`text-left px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                              activeId === id
                                ? "text-[#2563EB] bg-[#EFF6FF] dark:bg-[#1e3a5f]"
                                : "text-[#64748B] dark:text-[#94A3B8] hover:text-[#0A0A0A] dark:hover:text-[#F5F5F5]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </nav>

                      {/* Spacer */}
                      <div className="flex-1" />

                      {/* Social icons at bottom */}
                      <div className="flex items-center gap-4 pt-6 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                        {SOCIALS.map(({ icon: Icon, href, label }) => (
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#2563EB] transition-colors"
                          >
                            <Icon size={20} />
                          </a>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ScrollToTop lives here so it is always mounted alongside the Navbar */}
      <ScrollToTop />
    </>
  );
}

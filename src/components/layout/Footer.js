"use client";

// Footer — three column on desktop, stacked on mobile.
// Left: logo + tagline | Center: quick nav | Right: social icons

import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const QUICK_LINKS = [
  { label: "About", id: "about" },
  { label: "Projects", id: "projects" },
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

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export default function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#0A0A0A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Three columns ──────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Left — Logo + tagline */}
          <div className="flex flex-col gap-3">
            <p
              className="text-xl font-bold text-[#0A0A0A] dark:text-[#F5F5F5]"
              style={{
                fontFamily:
                  'var(--font-ibm-plex-sans, "IBM Plex Sans", sans-serif)',
              }}
            >
              Asif<span className="text-[#2563EB]">.</span>
            </p>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed max-w-xs">
              Building things for the web.
            </p>
          </div>

          {/* Center — Quick nav */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8]">
              Navigate
            </p>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {QUICK_LINKS.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="text-left text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#2563EB] transition-colors duration-200 w-fit"
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right — Social icons */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8]">
              Find me
            </p>
            <div className="flex items-center gap-4">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#2563EB] transition-colors duration-200"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom border + copyright ──────────────────────── */}
        <div className="mt-10 pt-6 border-t border-[#E2E8F0] dark:border-[#1E293B]">
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] text-center sm:text-left">
            &copy; 2025 Asif. Built with Next.js and deployed on Vercel.
          </p>
        </div>
      </div>
    </footer>
  );
}

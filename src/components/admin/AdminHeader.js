"use client";

// src/components/admin/AdminHeader.js

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiBell } from "react-icons/fi";

const pageMeta = {
  "/admin": {
    title: "Dashboard",
    description: "Overview of your portfolio content",
  },
  "/admin/projects": {
    title: "Projects",
    description: "Manage your portfolio projects",
  },
  "/admin/skills": {
    title: "Skills",
    description: "Manage your skills and categories",
  },
  "/admin/experience": {
    title: "Experience",
    description: "Manage your work history",
  },
  "/admin/blog": {
    title: "Blog",
    description: "Write and manage blog posts",
  },
  "/admin/analytics": {
    title: "Analytics",
    description: "Portfolio traffic and engagement",
  },
};

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AdminHeader() {
  const pathname = usePathname();
  const meta = pageMeta[pathname] ?? { title: "Admin", description: "" };

  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateStr(formatDate(now));
      setTimeStr(formatTime(now));
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-[#0A0F1E] border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      {/* ── Left: breadcrumb-style title ── */}
      <div className="flex items-center gap-2">
        <span className="text-slate-600 text-sm">Admin</span>
        <span className="text-slate-700 text-sm">/</span>
        <span className="text-slate-200 text-sm font-semibold">
          {meta.title}
        </span>
      </div>

      {/* ── Right: date/time + avatar ── */}
      <div className="flex items-center gap-4">
        {/* Live clock */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-medium text-slate-300 tabular-nums leading-none">
            {timeStr}
          </span>
          <span className="text-[10px] text-slate-600 tabular-nums leading-none mt-0.5">
            {dateStr}
          </span>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Notification bell — placeholder for future use */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          aria-label="Notifications"
        >
          <FiBell size={15} />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold select-none">A</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-300 leading-none">
              Asif
            </p>
            <p className="text-[10px] text-slate-600 leading-none mt-0.5">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
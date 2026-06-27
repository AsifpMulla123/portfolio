"use client";

// src/components/admin/AdminSidebar.js
// Mobile admin access is not supported — admin is desktop only.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiFolder,
  FiCode,
  FiBriefcase,
  FiEdit,
  FiBarChart2,
  FiExternalLink,
  FiLogOut,
} from "react-icons/fi";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FiHome, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FiFolder },
  { href: "/admin/skills", label: "Skills", icon: FiCode },
  { href: "/admin/experience", label: "Experience", icon: FiBriefcase },
  { href: "/admin/blog", label: "Blog", icon: FiEdit },
  { href: "/admin/analytics", label: "Analytics", icon: FiBarChart2 },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    // Hidden on mobile — admin is desktop-only
    <aside className="hidden lg:flex flex-col w-60 bg-[#0A0F1E] h-screen shrink-0 border-r border-slate-800">
      {/* ── Brand ── */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          {/* Blue accent square — matches login page brand mark */}
          <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold select-none">A</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">
              Asif
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5 leading-none">
              Portfolio CMS
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800 mx-4 mb-3" />

      {/* ── Navigation label ── */}
      <p className="px-5 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
        Content
      </p>

      {/* ── Nav items ── */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${
                  active
                    ? // Active: solid blue bg + white text + left accent bar effect
                      "bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/20"
                    : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 border border-transparent"
                }
              `}
            >
              <Icon
                size={16}
                className={active ? "text-[#60A5FA]" : "text-slate-600"}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-3 pb-5 mt-2">
        <div className="border-t border-slate-800 mb-3" />

        {/* View portfolio */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-800/60 hover:text-slate-300 transition-all border border-transparent"
        >
          <FiExternalLink size={16} className="text-slate-600" />
          View Portfolio
        </a>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-950/40 hover:text-red-400 transition-all border border-transparent"
        >
          <FiLogOut size={16} className="text-slate-600" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

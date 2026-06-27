// src/app/admin/(protected)/page.js
// SERVER COMPONENT — queries MongoDB directly for live counts.
// force-dynamic ensures the admin always sees fresh numbers.

import connectDB from "@/lib/db/mongodb";
import Project from "@/lib/db/models/Project";
import Skill from "@/lib/db/models/Skill";
import Experience from "@/lib/db/models/Experience";
import Blog from "@/lib/db/models/Blog";
import Contact from "@/lib/db/models/Contact";
import Link from "next/link";
import {
  FiFolder,
  FiCode,
  FiBriefcase,
  FiEdit,
  FiMail,
  FiClock,
  FiArrowRight,
  FiEye,
  FiFileText,
} from "react-icons/fi";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

// ─── Data fetcher ────────────────────────────────────────────────────────────
async function getDashboardData() {
  await connectDB();

  const [
    totalProjects,
    publishedProjects,
    totalSkills,
    totalExperience,
    totalPosts,
    publishedPosts,
    draftPosts,
    totalMessages,
    unreadMessages,
    recentMessages,
    recentPosts,
  ] = await Promise.all([
    Project.countDocuments({ status: { $ne: "archived" } }),
    Project.countDocuments({ status: "published" }),
    Skill.countDocuments(),
    Experience.countDocuments(),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
    Contact.countDocuments(),
    Contact.countDocuments({ read: false }),
    Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email subject createdAt read")
      .lean(),
    Blog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status createdAt")
      .lean(),
  ]);

  return {
    projects: { total: totalProjects, published: publishedProjects },
    skills: { total: totalSkills },
    experience: { total: totalExperience },
    blog: { total: totalPosts, published: publishedPosts, drafts: draftPosts },
    messages: { total: totalMessages, unread: unreadMessages },
    recentMessages,
    recentPosts,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, href, accent }) {
  return (
    <Link
      href={href}
      className="group bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-4 hover:border-slate-700 transition-all"
    >
      {/* Top row: icon + arrow */}
      <div className="flex items-center justify-between">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}18` }}
        >
          <Icon size={17} style={{ color: accent }} />
        </div>
        <FiArrowRight
          size={14}
          className="text-slate-700 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all"
        />
      </div>

      {/* Number */}
      <div>
        <p className="text-3xl font-bold text-white tabular-nums leading-none">
          {value}
        </p>
        <p className="text-sm font-medium text-slate-400 mt-1">{label}</p>
        {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      icon: FiFolder,
      label: "Projects",
      value: data.projects.total,
      sub: `${data.projects.published} published`,
      href: "/admin/projects",
      accent: "#2563EB",
    },
    {
      icon: FiCode,
      label: "Skills",
      value: data.skills.total,
      sub: "across all categories",
      href: "/admin/skills",
      accent: "#8B5CF6",
    },
    {
      icon: FiBriefcase,
      label: "Experience",
      value: data.experience.total,
      sub: data.experience.total === 1 ? "position" : "positions",
      href: "/admin/experience",
      accent: "#F59E0B",
    },
    {
      icon: FiEdit,
      label: "Blog Posts",
      value: data.blog.total,
      sub: `${data.blog.published} published · ${data.blog.drafts} drafts`,
      href: "/admin/blog",
      accent: "#10B981",
    },
    {
      icon: FiMail,
      label: "Messages",
      value: data.messages.total,
      sub:
        data.messages.unread > 0
          ? `${data.messages.unread} unread`
          : "all read",
      href: "/admin/analytics",
      accent: "#F43F5E",
    },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      {/* ── Page heading ── */}
      <div>
        <h1 className="text-xl font-bold text-white">Good to see you, Asif.</h1>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* ── Activity grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent messages */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FiMail size={14} className="text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-200">
                Recent Messages
              </h2>
            </div>
            {data.messages.unread > 0 && (
              <span className="text-[11px] font-semibold bg-red-950/60 text-red-400 border border-red-800/40 px-2 py-0.5 rounded-full">
                {data.messages.unread} unread
              </span>
            )}
          </div>

          {data.recentMessages.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <FiMail size={22} className="text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No messages yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {data.recentMessages.map((msg) => (
                <li
                  key={msg._id.toString()}
                  className="px-5 py-3.5 flex items-start justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    {/* Unread indicator */}
                    <div
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${msg.read ? "bg-transparent" : "bg-[#2563EB]"}`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {msg.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {msg.subject || msg.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-600 shrink-0 flex items-center gap-1 mt-0.5 tabular-nums">
                    <FiClock size={10} />
                    {timeAgo(msg.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent posts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
            <FiEdit size={14} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-200">
              Recent Posts
            </h2>
          </div>

          {data.recentPosts.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <FiFileText size={22} className="text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No posts yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {data.recentPosts.map((post) => (
                <li
                  key={post._id.toString()}
                  className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                >
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-slate-600 flex items-center gap-1 tabular-nums">
                      <FiClock size={10} />
                      {timeAgo(post.createdAt)}
                    </span>
                    {/* Status badge */}
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                        post.status === "published"
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/40"
                          : "bg-slate-800 text-slate-500 border-slate-700"
                      }`}
                    >
                      {post.status === "published" ? (
                        <>
                          <FiEye size={9} />
                          Live
                        </>
                      ) : (
                        <>
                          <FiFileText size={9} />
                          Draft
                        </>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Getting started banner — only when portfolio is empty ── */}
      {data.projects.total === 0 &&
        data.blog.total === 0 &&
        data.skills.total === 0 && (
          <div className="bg-[#2563EB]/10 border border-[#2563EB]/20 rounded-xl px-5 py-4 mb-12">
            <p className="text-sm font-semibold text-[#60A5FA] mb-1">
              Getting started
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Start by adding your skills, then projects, then experience. Once
              ready, click{" "}
              <strong className="text-slate-300">Publish to Live Site</strong>{" "}
              in any section to push changes live instantly.
            </p>
          </div>
        )}
    </div>
  );
}

"use client";

// src/app/admin/(protected)/page.js
// Client component — uses SWR to fetch dashboard data from /api/analytics/dashboard.
// Charts are lazy loaded via dynamic() so Recharts bundle doesn't block initial paint.

import { useState } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  FiEye,
  FiMail,
  FiFolder,
  FiBookOpen,
  FiTrendingUp,
  FiUsers,
  FiRefreshCw,
} from "react-icons/fi";
import { format } from "date-fns";

// ─── Lazy load charts — Recharts is heavy, only load when needed ──────────────
const PageViewsLineChart = dynamic(
  () =>
    import("@/components/admin/AnalyticsChart").then(
      (m) => m.PageViewsLineChart,
    ),
  { loading: () => <Skeleton className="h-72 w-full" />, ssr: false },
);

const TopPagesBarChart = dynamic(
  () =>
    import("@/components/admin/AnalyticsChart").then((m) => m.TopPagesBarChart),
  { loading: () => <Skeleton className="h-64 w-full" />, ssr: false },
);

const ContactsPieChart = dynamic(
  () =>
    import("@/components/admin/AnalyticsChart").then((m) => m.ContactsPieChart),
  { loading: () => <Skeleton className="h-64 w-full" />, ssr: false },
);

// ─── SWR fetcher — unwraps the { success, message, data } envelope ────────────
const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    .then((d) => d.data);

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, sublabel, value, isLoading, accent }) {
  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl p-6">
      <div className="flex items-start justify-between">
        {/* Icon container */}
        <div
          className="rounded-xl p-2"
          style={{ backgroundColor: `${accent}18` }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>

      <div className="mt-4">
        {/* Value — skeleton while loading */}
        {isLoading ? (
          <Skeleton className="h-9 w-16 mb-1" />
        ) : (
          <p className="text-3xl font-bold text-white tabular-nums leading-none">
            {value ?? 0}
          </p>
        )}
        <p className="text-sm font-medium text-slate-400 mt-1">{label}</p>
        <p className="text-xs text-slate-600 mt-0.5">{sublabel}</p>
      </div>
    </Card>
  );
}

// ─── Error card — shown when SWR fails ───────────────────────────────────────
function ErrorCard({ onRetry }) {
  return (
    <Card className="bg-slate-900 border-slate-800 rounded-2xl p-8 text-center">
      <p className="text-sm text-slate-400 mb-4">
        Failed to load dashboard data.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-sm text-[#2563EB] hover:underline"
      >
        <FiRefreshCw size={13} />
        Retry
      </button>
    </Card>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  // Track read/unread toggle per contact row locally
  // (a full toggle would need a PATCH call — this is a lightweight UI state)
  const [readState, setReadState] = useState({});

  const { data, isLoading, error, mutate } = useSWR(
    "/api/analytics/dashboard?days=30",
    fetcher,
    {
      // Refresh every 60 seconds so the admin sees fresh counts without reload
      refreshInterval: 60000,
    },
  );

  // ── Stat card definitions ──
  const stats = [
    {
      icon: FiEye,
      label: "Page Views",
      sublabel: "Last 30 days",
      value: data?.totalPageViews,
      accent: "#2563EB",
    },
    {
      icon: FiMail,
      label: "Messages Received",
      sublabel: "All time",
      value: data?.totalContacts,
      accent: "#10B981",
    },
    {
      icon: FiFolder,
      label: "Projects",
      sublabel: "In portfolio",
      value: data?.totalProjects,
      accent: "#F59E0B",
    },
    {
      icon: FiBookOpen,
      label: "Blog Posts",
      sublabel: "Published",
      value: data?.totalBlogPosts,
      // Purple is allowed here per spec — only place in the whole project
      accent: "#8B5CF6",
    },
  ];

  // ── Format contactsBySubject object into array for PieChart ──
  // API returns { "Job Opportunity": 3, "Freelance": 1, ... }
  // PieChart expects [{ name, value }, ...]
  const contactsPieData = data?.contactsBySubject
    ? Object.entries(data.contactsBySubject).map(([name, value]) => ({
        name: name || "Other",
        value,
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}

      {/* ── Error state ── */}
      {error && !isLoading && <ErrorCard onRetry={() => mutate()} />}

      {/* ── Stat cards: 2 cols mobile / 4 cols desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} isLoading={isLoading} />
        ))}
      </div>

      {/* ── Page Views line chart (full width) ── */}
      <Card className="bg-slate-900 border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp size={15} className="text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-200">
            Page Views — Last 30 Days
          </h2>
        </div>
        <PageViewsLineChart data={data?.pageViewsByDay ?? []} />
      </Card>

      {/* ── Two chart grid: Top Pages + Contact Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top pages */}
        <Card className="bg-slate-900 border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiEye size={15} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-200">Top Pages</h2>
          </div>
          <TopPagesBarChart data={data?.topPages ?? []} />
        </Card>

        {/* Contact breakdown */}
        <Card className="bg-slate-900 border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiMail size={15} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-200">
              Inquiries by Type
            </h2>
          </div>
          <ContactsPieChart data={contactsPieData} />
        </Card>
      </div>

      {/* ── Recent contacts table ── */}
      <Card className="bg-slate-900 border-slate-800 rounded-2xl overflow-hidden mb-12">
        {/* Table header row */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FiUsers size={15} className="text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-200">
              Recent Messages
            </h2>
          </div>
          <a
            href="/admin/analytics"
            className="text-xs text-[#2563EB] hover:underline"
          >
            View All →
          </a>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading &&
          (!data?.recentContacts || data.recentContacts.length === 0) && (
            <div className="px-6 py-10 text-center">
              <FiMail size={22} className="text-slate-700 mx-auto mb-2" />
              <p className="text-sm text-slate-600">No messages yet</p>
            </div>
          )}

        {/* Table — only render when data is present */}
        {!isLoading && data?.recentContacts?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-xs font-medium text-slate-500 px-6 py-3">
                    Name
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3 hidden md:table-cell">
                    Email
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">
                    Subject
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.recentContacts.map((contact) => {
                  // Use local readState override if admin toggled it this session,
                  // otherwise fall back to the value from the API
                  const isRead =
                    readState[contact._id] !== undefined
                      ? readState[contact._id]
                      : contact.read;

                  return (
                    <tr
                      key={contact._id}
                      // Highlight unread rows with a subtle accent tint
                      className={`transition-colors hover:bg-slate-800/50 ${
                        !isRead ? "bg-[#2563EB]/5" : ""
                      }`}
                    >
                      <td className="px-6 py-3.5 font-medium text-slate-200 whitespace-nowrap">
                        {contact.name}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 hidden md:table-cell truncate max-w-45">
                        {contact.email}
                      </td>
                      <td className="px-4 py-3.5">
                        {/* Subject as a colored badge */}
                        <Badge
                          variant="outline"
                          className="text-[11px] border-slate-700 text-slate-400 bg-slate-800/50"
                        >
                          {contact.subject || "General"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 hidden lg:table-cell whitespace-nowrap">
                        {format(new Date(contact.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3.5">
                        {/* Toggle read/unread — local UI state only */}
                        <button
                          onClick={() =>
                            setReadState((prev) => ({
                              ...prev,
                              [contact._id]: !isRead,
                            }))
                          }
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                            isRead
                              ? "bg-slate-800 text-slate-500 border-slate-700 hover:border-slate-600"
                              : "bg-[#2563EB]/10 text-[#60A5FA] border-[#2563EB]/30 hover:bg-[#2563EB]/20"
                          }`}
                        >
                          {isRead ? "Read" : "Unread"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

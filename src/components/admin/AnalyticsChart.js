"use client";

// src/components/admin/AnalyticsChart.js
// Three named chart exports used on the admin dashboard.
// All use Recharts — this file is always lazy-loaded via dynamic() to keep
// the Recharts bundle out of the initial JS that users download.
// Dark mode: uses CSS variables so charts match the admin dark theme.

import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Shared constants ─────────────────────────────────────────────────────────

const ACCENT_BLUE = "#2563EB";
const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"];
const GRID_COLOR = "#1E293B"; // slate-800 — matches dark admin bg
const AXIS_TICK_COLOR = "#64748B"; // slate-500

// ─── Custom tooltip wrapper — used by all three charts ────────────────────────
// White-bg tooltip with a subtle border, works in both light and dark context.
function TooltipBox({ children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm shadow-lg">
      {children}
    </div>
  );
}

// ─── Empty state — shown when data array is empty ─────────────────────────────
function EmptyState({ message = "No data yet" }) {
  return (
    <div className="flex items-center justify-center h-full min-h-50">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

// =============================================================================
// 1. PageViewsLineChart
// Props:
//   data      — array of { date: string (ISO), count: number }
//   isLoading — boolean
// =============================================================================

// Custom tooltip for the line chart — shows the full date + view count.
function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      <p className="font-medium text-slate-800 dark:text-slate-200">
        {/* label here is the raw date string from the data array */}
        {label}
      </p>
      <p className="text-[#2563EB] mt-0.5">
        {payload[0].value}{" "}
        <span className="text-slate-500 font-normal">views</span>
      </p>
    </TooltipBox>
  );
}

export function PageViewsLineChart({ data = [], isLoading = false }) {
  if (isLoading) {
    return <Skeleton className="h-75 w-full rounded-xl" />;
  }

  if (!data.length) {
    return <EmptyState message="No page view data yet" />;
  }

  // Format the date label shown on the X axis: "Jun 28" style.
  // We parse ISO strings here so the axis ticks are readable.
  const formatted = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "MMM dd"),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={formatted}
        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
      >
        {/* Horizontal grid lines only — vertical lines add visual noise */}
        <CartesianGrid horizontal={true} vertical={false} stroke={GRID_COLOR} />

        <XAxis
          dataKey="label"
          tick={{ fill: AXIS_TICK_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          // Show every 5th tick so dates don't overlap on small screens
          interval={Math.floor(formatted.length / 6)}
        />

        <YAxis
          tick={{ fill: AXIS_TICK_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />

        <Tooltip content={<LineTooltip />} />

        <Line
          type="monotone"
          dataKey="count"
          stroke={ACCENT_BLUE}
          strokeWidth={2}
          dot={false} // No dots — keeps the line clean
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// =============================================================================
// 2. TopPagesBarChart
// Props:
//   data      — array of { page: string, count: number }
//   isLoading — boolean
// =============================================================================

// Truncate long page paths so they fit the X axis without overlapping.
function truncatePage(page, max = 15) {
  if (page.length <= max) return page;
  return page.slice(0, max) + "…";
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <TooltipBox>
      {/* Show the full page path in the tooltip even if truncated on axis */}
      <p className="font-medium text-slate-800 dark:text-slate-200">{label}</p>
      <p className="text-[#2563EB] mt-0.5">
        {payload[0].value}{" "}
        <span className="text-slate-500 font-normal">visits</span>
      </p>
    </TooltipBox>
  );
}

export function TopPagesBarChart({ data = [], isLoading = false }) {
  if (isLoading) {
    return <Skeleton className="h-62.5 w-full rounded-xl" />;
  }

  if (!data.length) {
    return <EmptyState message="No page data yet" />;
  }

  const formatted = data.map((d) => ({
    ...d,
    shortPage: truncatePage(d.page),
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={formatted}
        margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
      >
        <CartesianGrid horizontal={true} vertical={false} stroke={GRID_COLOR} />

        <XAxis
          dataKey="shortPage"
          tick={{ fill: AXIS_TICK_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: AXIS_TICK_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />

        <Tooltip content={<BarTooltip />} cursor={{ fill: "#1E293B" }} />

        <Bar
          dataKey="count"
          fill={ACCENT_BLUE}
          // Rounded top corners only — bottom corners stay square (flush to axis)
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// =============================================================================
// 3. ContactsPieChart
// Props:
//   data      — array of { name: string, value: number }
//   isLoading — boolean
// =============================================================================

// Custom label rendered inside each pie slice: "name 42%"
function PieSliceLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) {
  // Don't render a label on tiny slices — they'd overlap and look broken.
  if (percent < 0.08) return null;

  // Position the label in the middle of the slice arc.
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <TooltipBox>
      <p className="font-medium text-slate-800 dark:text-slate-200">
        {item.name}
      </p>
      <p style={{ color: item.payload.fill }} className="mt-0.5">
        {item.value}{" "}
        <span className="text-slate-500 font-normal">messages</span>
      </p>
    </TooltipBox>
  );
}

export function ContactsPieChart({ data = [], isLoading = false }) {
  if (isLoading) {
    return <Skeleton className="h-62.5 w-full rounded-xl" />;
  }

  if (!data.length) {
    return <EmptyState message="No contact data yet" />;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          outerRadius={80}
          dataKey="value"
          labelLine={false}
          label={PieSliceLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip content={<PieTooltip />} />

        {/* Legend sits below the chart — shows color swatches + names */}
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{
            fontSize: "12px",
            color: AXIS_TICK_COLOR,
            paddingTop: "8px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

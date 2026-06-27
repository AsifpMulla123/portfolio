"use client";

// src/components/admin/PublishButton.js
//
// This button calls Next.js on-demand revalidation.
// It rebuilds ONLY the specified pages — not the entire site.
// Visitors see updated content within seconds of clicking this button.
// Without clicking this, changes saved in admin are NOT visible on the live site.
//
// NEXT_PUBLIC_REVALIDATION_SECRET must be set in .env.local
// Add: NEXT_PUBLIC_REVALIDATION_SECRET=same_value_as_REVALIDATION_SECRET

import { useState } from "react";
import { FiRefreshCw, FiCheck, FiAlertCircle } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Status type: 'idle' | 'publishing' | 'success' | 'error'

/**
 * PublishButton — triggers on-demand ISR revalidation for specified paths.
 *
 * @param {string[]} paths  - Array of Next.js paths to revalidate.
 *                            e.g. ['/', '/blog', '/blog/my-post']
 */
export default function PublishButton({ paths = ["/"] }) {
  const [status, setStatus] = useState("idle");

  const handlePublish = async () => {
    setStatus("publishing");

    try {
      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paths,
          // This secret must match REVALIDATION_SECRET on the server.
          // It's NEXT_PUBLIC_ so the client bundle can read it — that's intentional.
          // The secret is not sensitive data; it just prevents random revalidation calls.
          secret: process.env.NEXT_PUBLIC_REVALIDATION_SECRET,
        }),
      });

      if (!res.ok) throw new Error("Revalidation request failed");

      setStatus("success");
      // Auto-reset back to idle after 3 seconds so the button can be used again
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      // Auto-reset on error too so the user can retry
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // ── Derive button appearance from current status ──────────────────────────

  const isDisabled = status === "publishing" || status === "success";

  const buttonConfig = {
    idle: {
      className: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white",
      label: "Publish to Live Site",
      icon: null, // icon rendered separately so we can add spin class
    },
    publishing: {
      className: "bg-[#2563EB] opacity-70 cursor-not-allowed text-white",
      label: "Publishing...",
      icon: null,
    },
    success: {
      className: "bg-[#10B981] cursor-default text-white",
      label: "Published!",
      icon: <FiCheck size={16} className="shrink-0" />,
    },
    error: {
      className: "bg-red-500 hover:bg-red-600 text-white",
      label: "Failed — Retry",
      icon: <FiAlertCircle size={16} className="shrink-0" />,
    },
  };

  const config = buttonConfig[status];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* asChild passes the tooltip trigger props down to our button */}
          <button
            onClick={
              status === "error"
                ? handlePublish
                : status === "idle"
                  ? handlePublish
                  : undefined
            }
            disabled={isDisabled}
            className={`
              inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2
              disabled:cursor-not-allowed
              ${config.className}
            `}
          >
            {/* Icon area — spinner during publishing, static icon otherwise */}
            {status === "idle" && (
              <FiRefreshCw size={16} className="shrink-0" />
            )}
            {status === "publishing" && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
            )}
            {status === "success" && config.icon}
            {status === "error" && config.icon}

            {config.label}
          </button>
        </TooltipTrigger>

        {/* Tooltip only shown in idle state — it explains what the button does */}
        {status === "idle" && (
          <TooltipContent side="bottom" className="max-w-xs text-center">
            This will rebuild the live portfolio with your latest changes
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

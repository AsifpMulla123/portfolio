"use client";

// AnalyticsTracker — fires a single page_view event to /api/analytics on mount.
// Loaded lazily in layout.js so it never delays page rendering.
// All errors are swallowed — analytics must never break the user experience.

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    async function trackPageView() {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "page_view",
            page: window.location.pathname,
            referrer: document.referrer || "",
          }),
        });
      } catch {
        // Silently ignore — analytics failures must not affect the visitor
      }
    }

    trackPageView();
  }, []);

  // This component renders nothing — it is a side-effect only
  return null;
}

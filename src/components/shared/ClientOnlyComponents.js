"use client";

// Client-only wrapper — dynamic with ssr:false is only allowed in Client Components.
// layout.js (server) imports this instead of using dynamic() directly.

import dynamic from "next/dynamic";

const PageLoader = dynamic(() => import("@/components/shared/PageLoader"), {
  ssr: false,
});

const AnalyticsTracker = dynamic(
  () => import("@/components/shared/AnalyticsTracker"),
  { ssr: false },
);

export default function ClientOnlyComponents() {
  return (
    <>
      <PageLoader />
      <AnalyticsTracker />
    </>
  );
}

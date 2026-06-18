// 404 page — rendered automatically by Next.js for any unmatched route.
// Layout (Navbar + Footer) wraps it automatically via src/app/layout.js.

import Link from "next/link";

export const metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Large 404 number */}
      <p className="text-8xl text-[#2563EB] font-(--font-ibm-plex-sans) select-none">
        404
      </p>

      {/* Heading */}
      <h1 className="mt-4 text-3xl text-[#0A0A0A] dark:text-[#F5F5F5] font-(--font-ibm-plex-sans)">
        Page Not Found
      </h1>

      {/* Short message */}
      <p className="mt-3 text-base text-[#64748B] max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>

      {/* Go Home button */}
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-md border border-[#2563EB] text-[#2563EB] font-medium text-sm hover:bg-[#2563EB] hover:text-white transition-colors duration-200"
      >
        Go Home
      </Link>
    </section>
  );
}

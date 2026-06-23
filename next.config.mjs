/** @type {import('next').NextConfig} */

// Content Security Policy — restricts what sources can load scripts, styles, etc.
// We allow 'unsafe-inline' for styles because Tailwind/shadcn inject inline styles at runtime.
// We allow 'unsafe-eval' in dev only so Next.js hot reload works.
const isDev = process.env.NODE_ENV === "development";

const cspDirectives = [
  "default-src 'self'",
  // Scripts: allow self + Vercel analytics in prod, plus eval in dev for HMR
  isDev
    ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com"
    : "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  // Styles: unsafe-inline needed for Tailwind CSS + shadcn runtime injection
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts: Google Fonts + self
  "font-src 'self' https://fonts.gstatic.com",
  // Images: self + GitHub avatars (for open source section)
  "img-src 'self' data: https://avatars.githubusercontent.com",
  // API calls: only to self (no third-party fetch allowed from browser)
  "connect-src 'self' https://challenges.cloudflare.com",
  // No iframes from outside
  "frame-src https://challenges.cloudflare.com",
  // No plugins (Flash etc.)
  "object-src 'none'",
  // Base URI locked to self
  "base-uri 'self'",
  // Forms can only submit to self
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  {
    // Prevent this site from being embedded in iframes on other domains
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    // Prevent browsers from MIME-sniffing the content type
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Send full URL as referrer within same origin, only origin cross-origin
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Disable camera, microphone, and geolocation APIs — portfolio doesn't need them
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    // Content Security Policy assembled above
    key: "Content-Security-Policy",
    value: cspDirectives,
  },
];

const nextConfig = {
  // ─── Performance ───────────────────────────────────────────────────────────

  // Enable gzip/brotli compression for all responses
  compress: true,

  // Remove "X-Powered-By: Next.js" header — small security improvement
  poweredByHeader: false,

  // ─── Package Optimizations ─────────────────────────────────────────────────

  // Tree-shake these large icon/animation libraries at build time.
  // Without this, importing one icon from react-icons loads the entire library.
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion", "recharts"],
  },

  // ─── Images ────────────────────────────────────────────────────────────────

  images: {
    // Modern formats only — avif is smaller than webp, webp is fallback
    formats: ["image/avif", "image/webp"],

    // Allow GitHub avatars for the open source contributions section
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // ─── Security Headers ──────────────────────────────────────────────────────

  async headers() {
    return [
      {
        // Apply security headers to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

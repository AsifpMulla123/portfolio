/** @type {import('next-sitemap').IConfig} */

// next-sitemap runs as a postbuild script and generates:
//   1. /public/sitemap.xml  — all public pages
//   2. /public/robots.txt   — crawl rules for search engines
//
// Run via: "postbuild": "next-sitemap" in package.json scripts

module.exports = {
  // Base URL for all sitemap entries — set this in Vercel environment variables
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://mydomain.com",

  // Auto-generate robots.txt alongside sitemap.xml
  generateRobotsTxt: true,

  // Pages to exclude from the sitemap entirely
  // Admin and API routes should never be indexed
  exclude: ["/admin", "/admin/*", "/api/*"],

  // robots.txt rules — tells crawlers what they can and cannot access
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*", // Applies to all bots (Google, Bing, etc.)
        allow: "/", // Allow crawling all public pages
        disallow: [
          "/admin", // Block admin dashboard
          "/api", // Block all API endpoints
        ],
      },
    ],

    // The sitemap URL is automatically added to robots.txt by next-sitemap
    // No need to manually specify it here
  },
};

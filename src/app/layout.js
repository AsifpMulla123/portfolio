// src/app/layout.js
// Root layout — server component, no 'use client'

import { IBM_Plex_Sans, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asif.dev";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Asif | Full Stack Developer",
    template: "%s | Asif",
  },
  description:
    "Full Stack Developer specializing in MERN stack, Next.js, and cloud solutions. Building scalable web applications that solve real problems.",
  keywords: [
    "Full Stack Developer",
    "MERN Stack",
    "Next.js",
    "React",
    "Node.js",
    "MongoDB",
    "AWS",
    "India",
  ],
  authors: [{ name: "Asif" }],
  creator: "Asif",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Asif | Full Stack Developer",
    title: "Asif | Full Stack Developer",
    description:
      "Full Stack Developer specializing in MERN stack, Next.js, and cloud solutions. Building scalable web applications that solve real problems.",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Asif — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Asif | Full Stack Developer",
    description:
      "Full Stack Developer specializing in MERN stack, Next.js, and cloud solutions. Building scalable web applications that solve real problems.",
    creator: "@asif-dev",
    images: ["/og/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD goes in metadata.other so Next.js injects it properly
// without needing a raw <script> tag in JSX
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${ibmPlexSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Asif",
              jobTitle: "Full Stack Developer",
              url: siteUrl,
              sameAs: [
                "https://github.com/asif-dev",
                "https://linkedin.com/in/asif-dev",
              ],
              knowsAbout: [
                "React",
                "Node.js",
                "MongoDB",
                "Next.js",
                "AWS",
                "C++",
              ],
            }),
          }}
        />
      </head>
      <body
        className="font-sans antialiased bg-white dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#F5F5F5] transition-colors duration-300"
        suppressHydrationWarning
      >
        {/* ThemeProvider handles dark mode flash prevention internally */}
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

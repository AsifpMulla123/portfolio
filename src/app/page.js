// This is a Server Component — no "use client" directive.
// force-static means Next.js builds this page once at deploy time.
// It is never rebuilt on a visitor request — zero DB calls on load.
// The admin's PublishButton triggers on-demand revalidation via /api/revalidate
// when content changes, which causes Next.js to rebuild just this page.

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import OpenSource from "@/components/sections/OpenSource";

export const dynamic = "force-static";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Certifications />
      <OpenSource />
      {/* More sections added daily */}
    </main>
  );
}

// src/app/(portfolio)/layout.js
// Layout for all public portfolio pages: /, /blog, /blog/[slug]
//
// Route group (portfolio) keeps URLs clean — the folder name is invisible:
// (portfolio)/page.js        → accessible at /
// (portfolio)/blog/page.js   → accessible at /blog
//
// This is where Navbar, Footer, and ClientOnlyComponents live.
// Admin pages never touch this layout.

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClientOnlyComponents from "@/components/shared/ClientOnlyComponents";

export default function PortfolioLayout({ children }) {
  return (
    <>
      <ClientOnlyComponents />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

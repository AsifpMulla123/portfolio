// src/app/admin/(protected)/layout.js
// This layout only wraps pages INSIDE the (protected) route group.
// URLs are unaffected — (protected) is invisible in the URL.
// /admin/(protected)/page.js        → accessible at /admin
// /admin/(protected)/projects/page.js → accessible at /admin/projects
//
// Middleware.js already redirects unauthenticated users to /admin/login
// before they ever reach this layout. The sidebar and header are safe
// to render here because only authenticated requests get through.

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function ProtectedAdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Fixed left sidebar — desktop only */}
      <AdminSidebar />

      {/* Right column: header + scrollable page content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

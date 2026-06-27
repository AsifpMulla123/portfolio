// src/app/admin/layout.js
// ROOT admin layout — intentionally minimal.
// This wraps ALL /admin routes including /admin/login.
// It must NOT include AdminSidebar or AdminHeader because the login
// page should be a plain centered card with no chrome around it.
// The sidebar/header shell lives in (protected)/layout.js instead,
// which only wraps the pages that need it.

export const metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return <>{children}</>;
}

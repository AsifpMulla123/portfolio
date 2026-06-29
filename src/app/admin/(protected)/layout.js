// src/app/admin/(protected)/layout.js
// SERVER COMPONENT — runs on the server, never on the client.
//
// WHY AUTH CHECK HERE INSTEAD OF MIDDLEWARE:
// Middleware runs on the Edge Runtime which has restrictions on Node.js APIs.
// Doing auth in a server component layout uses the full Node.js runtime —
// same environment as our API routes — so it's 100% reliable.
//
// This layout wraps EVERY protected admin page. If the cookie is missing
// or invalid, we redirect to login before the page ever renders.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

async function verifyAdminSession() {
  // Read the httpOnly cookie set at login
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  // No cookie — not logged in
  if (!token) return false;

  try {
    // Decode base64 JWT_SECRET is not needed here — JWT_SECRET has no $ signs
    // so it reads correctly from env without any encoding tricks
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    // Token expired or tampered
    return false;
  }
}

export default async function ProtectedAdminLayout({ children }) {
  // Check auth on EVERY render of any protected admin page
  const isAuthenticated = await verifyAdminSession();

  // Not authenticated — redirect to login immediately
  // redirect() throws internally so nothing below this line runs
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  // Authenticated — render the admin shell
  return (
    <div className="flex h-screen bg-[#0A0F1E]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}

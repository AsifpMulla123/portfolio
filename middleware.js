
// middleware.js — root of project (same level as package.json)

// middleware.js — root of project (same level as package.json)
// Runs on the Edge BEFORE any page renders.
// Protects all /admin routes except /admin/login.

// middleware.js — root of project
// Kept minimal — actual auth happens in (protected)/layout.js server component.
// This only handles the matcher so Next.js doesn't do unnecessary work.

export function middleware() {
  // Auth is handled in src/app/admin/(protected)/layout.js
  // That server component checks the cookie and redirects if invalid.
}

export const config = {
  matcher: [],
};

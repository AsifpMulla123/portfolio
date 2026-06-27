"use client";

// src/app/admin/login/page.js
// Never store the password beyond this component's lifetime.
// Verification happens server-side. JWT is set as httpOnly cookie.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiLock, FiAlertCircle } from "react-icons/fi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);

  const isLockedOut = failedAttempts >= 5;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLockedOut) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setFailedAttempts((prev) => prev + 1);
        setError(data.message || "Invalid password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Full-screen dark canvas — completely separate from the portfolio theme
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center p-4">
      {/* Subtle grid texture overlay for depth */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-95">
        {/* ── Brand mark ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2563EB] mb-5 shadow-lg shadow-blue-900/40">
            <FiLock size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">Asif · Portfolio CMS</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-7 shadow-2xl shadow-black/40">
          {isLockedOut ? (
            // Lockout state
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-950 border border-red-800 mb-4">
                <FiAlertCircle size={22} className="text-red-400" />
              </div>
              <p className="text-sm font-semibold text-red-400 mb-1">
                Too many failed attempts
              </p>
              <p className="text-xs text-slate-500">
                Account locked for 15 minutes. Try again later.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Password field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-400 uppercase tracking-widest"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff size={16} />
                    ) : (
                      <FiEye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-950/60 border border-red-800/60 rounded-lg px-3.5 py-2.5">
                  <FiAlertCircle
                    size={14}
                    className="text-red-400 mt-0.5 shrink-0"
                  />
                  <p className="text-xs text-red-400 leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              {/* Attempts remaining hint */}
              {failedAttempts > 0 && !error && (
                <p className="text-xs text-slate-500 text-center">
                  {5 - failedAttempts} attempt
                  {5 - failedAttempts !== 1 ? "s" : ""} remaining
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full flex items-center justify-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-colors mt-1"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-600 mt-6">
          Secured with JWT · httpOnly cookie
        </p>
      </div>
    </div>
  );
}

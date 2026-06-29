"use client";

// src/components/shared/ThemeProvider.js
// Handles dark mode without any inline <script> tags in layout.js.
//
// Flash prevention strategy:
// We set the theme class synchronously inside useState initializer.
// In Next.js 15 with Turbopack, useState(() => ...) runs before the
// first paint on the client, which prevents the light→dark flash
// without needing a blocking <script> tag.
//
// suppressHydrationWarning on <html> and <body> handles the SSR mismatch
// since the server renders without 'dark' class but the client adds it.

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

function getInitialTheme() {
  // This function only runs on the client (inside useState initializer).
  // It reads localStorage and OS preference synchronously before first paint.
  if (typeof window === "undefined") return "light";
  try {
    const saved = localStorage.getItem("portfolio-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}

function applyTheme(value) {
  if (typeof window === "undefined") return;
  if (value === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function ThemeProvider({ children }) {
  // useState with an initializer function runs synchronously on the client
  // before the component tree renders — this is what prevents the flash
  const [theme, setTheme] = useState(() => {
    const initial = getInitialTheme();
    // Apply immediately during initialization — before first paint
    applyTheme(initial);
    return initial;
  });

  // Keep the class in sync if theme changes after mount
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

"use client";

// ThemeProvider — applies the saved theme class to <html> before first paint.
// Lives here rather than in ThemeToggle so the toggle can be used anywhere
// without each instance fighting over document.documentElement.

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // On mount: check localStorage first, then OS preference
    const saved = localStorage.getItem("portfolio-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial = saved ?? (prefersDark ? "dark" : "light");

    setTheme(initial);
    applyTheme(initial);
  }, []);

  function applyTheme(value) {
    if (value === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    localStorage.setItem("portfolio-theme", next);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook for child components to read theme and trigger toggle
export function useTheme() {
  return useContext(ThemeContext);
}

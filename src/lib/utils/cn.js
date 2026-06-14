import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── Class Name Utility ────────────────────────────────────────────────────
//
// Combines two libraries:
//
//   clsx        — handles conditional class logic
//                 e.g. cn("base", isActive && "active", { hidden: !show })
//
//   tailwind-merge — intelligently merges Tailwind classes, removing conflicts
//                    e.g. cn("p-4", "p-8") → "p-8" (not "p-4 p-8")
//
// WHY both? clsx alone doesn't remove conflicting Tailwind classes.
// tailwind-merge alone doesn't handle conditional objects/arrays.
// Together they cover every use case cleanly.
//
// Usage:
//   import { cn } from "@/lib/utils/cn";
//   <div className={cn("base-class", isActive && "text-accent", className)} />
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merges class names with conflict resolution for Tailwind CSS.
 *
 * @param {...(string|undefined|null|boolean|object|array)} inputs
 * @returns {string} - Final merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

"use client";

import { MoonStar, SunMedium } from "lucide-react";

type ThemeToggleProps = {
  theme: "dark" | "light";
  onToggle: () => void;
};

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle light and dark theme"
      className="group relative inline-flex h-11 w-20 items-center rounded-full border border-[var(--border)] bg-[var(--panel-soft)] p-1 shadow-[0_10px_30px_rgba(15,23,42,0.12)] transition-all duration-300 hover:border-[var(--brand)]/60"
    >
      <span
        className={`absolute inset-1 flex items-center justify-center rounded-full transition-all duration-300 ${
          isDark ? "translate-x-9 bg-[var(--panel-elevated)]" : "translate-x-0 bg-[var(--panel-elevated)]"
        }`}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-2 text-[var(--text-soft)]">
        <SunMedium className={`h-4 w-4 transition ${isDark ? "opacity-40" : "opacity-100 text-[var(--brand)]"}`} />
        <MoonStar className={`h-4 w-4 transition ${isDark ? "opacity-100 text-[var(--brand)]" : "opacity-40"}`} />
      </span>
    </button>
  );
}

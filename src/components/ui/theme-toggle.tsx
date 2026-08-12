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
      className="group relative inline-flex h-11 w-20 items-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--panel-soft)] p-1 shadow-[0_10px_30px_rgba(15,23,42,0.12)] transition-all duration-300 hover:border-[var(--brand)]/60"
    >
      <span
        className={`absolute left-1 top-1 h-9 w-9 rounded-full bg-[var(--panel-elevated)] shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-transform duration-300 ${
          isDark ? "translate-x-9" : "translate-x-0"
        }`}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-2 text-[var(--text-soft)]">
        <SunMedium className={`h-4 w-4 transition ${isDark ? "opacity-40" : "opacity-100 text-[var(--brand)]"}`} />
        <MoonStar className={`h-4 w-4 transition ${isDark ? "opacity-100 text-[var(--brand)]" : "opacity-40"}`} />
      </span>
    </button>
  );
}

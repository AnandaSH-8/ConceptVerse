"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";

const STORAGE_KEY = "conceptverse-theme";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const preferredTheme =
      savedTheme ??
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(preferredTheme);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}

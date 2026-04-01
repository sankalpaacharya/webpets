"use client";

import * as React from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: "class" | `data-${string}` | Array<"class" | `data-${string}`>;
  defaultTheme?: "light" | "dark" | "system";
  enableSystem?: boolean;
  storageKey?: string;
};

function applyThemeClass(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
}: ThemeProviderProps) {
  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey) as
      | "light"
      | "dark"
      | "system"
      | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initial = stored ?? defaultTheme;
    const resolved =
      initial === "system"
        ? enableSystem && prefersDark
          ? "dark"
          : "light"
        : initial;
    applyThemeClass(resolved);
  }, [defaultTheme, enableSystem, storageKey]);

  return <>{children}</>;
}

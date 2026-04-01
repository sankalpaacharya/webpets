"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";

export function ThemeToggle() {
  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    root.classList.remove("light", "dark");
    root.classList.add(next);
    localStorage.setItem("theme", next);
  };

  return (
    <span onClick={toggleTheme} aria-label="Toggle theme">
      <span className="hidden dark:inline-flex">
        <HugeiconsIcon icon={Sun01Icon} />
      </span>
      <span className="inline-flex dark:hidden">
        <HugeiconsIcon icon={Moon02Icon} />
      </span>
    </span>
  );
}

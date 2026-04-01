"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme]);

  if (!resolvedTheme) {
    return null;
  }

  return (
    <span
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <HugeiconsIcon icon={Sun01Icon} />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} />
      )}
    </span>
  );
}

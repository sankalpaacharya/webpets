import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background text-xs">
            WP
          </div>
          <span className="text-sm font-semibold text-foreground">WebPet</span>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <Link href="/docs" className="transition hover:text-foreground">
            Docs
          </Link>
          <Link href="/components" className="transition hover:text-foreground">
            Components
          </Link>
          <Link href="/blocks" className="transition hover:text-foreground">
            Blocks
          </Link>
          <Link href="/themes" className="transition hover:text-foreground">
            Themes
          </Link>
          <Link href="/sponsors" className="transition hover:text-foreground">
            Sponsors
          </Link>
        </nav>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

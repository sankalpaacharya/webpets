"use client";

import { useState } from "react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { GifPet } from "./gif-pet";
import { Button } from "./ui/button";

export function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <GifPet animal="deno" color="green" followMouse={true} />
      <GifPet animal="dog" color="red" />
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-sm font-semibold text-foreground transition hover:text-foreground"
          >
            WebPet
          </Link>
        </div>
        <nav className="hidden flex-1 items-center gap-4 text-xs text-muted-foreground sm:flex">
          <Link href="/playground" className="transition hover:text-foreground">
            Playground
          </Link>
          <Link href="/credits" className="transition hover:text-foreground">
            Credits
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex">
            <ThemeToggle />
            <Button asChild variant="outline" className="text-xs">
              <Link
                href="https://github.com/sankalpaacharya/webpet"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </Link>
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            Menu
          </Button>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 pb-4 sm:hidden">
        <nav
          id="site-nav"
          className={`${menuOpen ? "flex dashboard-enter" : "hidden"} flex-col gap-3 text-xs text-muted-foreground`}
        >
          <Link href="/playground" className="transition hover:text-foreground">
            Playground
          </Link>
          <Link href="/credits" className="transition hover:text-foreground">
            Credits
          </Link>
          <div className="flex items-center gap-3 sm:hidden">
            <ThemeToggle />
            <Button asChild variant="outline" className="text-xs">
              <Link
                href="https://github.com/sankalpaacharya/webpet"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

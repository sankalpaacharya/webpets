import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { DOCS_LINKS, findDocLink } from "../nav";

type DocPageProps = {
  /** Route of this page, used for the title, description, and prev/next links. */
  href: string;
  children: ReactNode;
};

export function DocPage({ href, children }: DocPageProps) {
  const link = findDocLink(href);
  if (!link) throw new Error(`No docs nav entry for ${href}`);

  const index = DOCS_LINKS.indexOf(link);
  const prev = DOCS_LINKS[index - 1];
  const next = DOCS_LINKS[index + 1];

  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-10 lg:px-10">
      <div className="mb-6 flex items-center gap-2 md:hidden">
        <SidebarTrigger />
        <span className="text-sm text-muted-foreground">Menu</span>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{link.title}</h1>
        <p className="text-base text-muted-foreground">{link.description}</p>
      </header>

      <div className="mt-10 space-y-12">{children}</div>

      <Separator className="my-12" />

      <nav aria-label="Pagination" className="flex justify-between gap-4">
        {prev ? (
          <Button asChild variant="ghost" className="h-auto flex-col items-start gap-0.5 px-3 py-2">
            <Link href={prev.href}>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                Previous
              </span>
              <span>{prev.title}</span>
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild variant="ghost" className="h-auto flex-col items-end gap-0.5 px-3 py-2">
            <Link href={next.href}>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                Next
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </span>
              <span>{next.title}</span>
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

import Link from "next/link";
import { Children, isValidElement } from "react";
import type { ReactNode } from "react";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { DOCS_LINKS, findDocLink } from "../nav";
import { Section } from "./doc-primitives";
import { TableOfContents } from "./table-of-contents";
import type { TocItem } from "./table-of-contents";

/** Reads the id and title of every top-level <Section> so the TOC needs no DOM scan. */
function collectSections(children: ReactNode): TocItem[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ id: string; title: string }>(child)) return [];
    if (child.type !== Section) return [];
    return [{ id: child.props.id, title: child.props.title }];
  });
}

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
  const toc = collectSections(children);

  return (
    <div className="flex gap-10 py-10 md:pl-10">
      <article className="w-full min-w-0 max-w-3xl">
        <div className="mb-6 flex items-center gap-2 md:hidden">
          <SidebarTrigger />
          <span className="text-sm text-muted-foreground">Menu</span>
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {link.title}
          </h1>
          <p className="text-base text-muted-foreground">{link.description}</p>
        </header>

        <div className="mt-8 space-y-10">{children}</div>

        <Separator className="my-12" />

        <nav aria-label="Pagination" className="flex justify-between gap-4">
          {prev ? (
            <Button
              asChild
              variant="ghost"
              className="h-auto flex-col items-start gap-0.5 px-3 py-2"
            >
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
            <Button
              asChild
              variant="ghost"
              className="h-auto flex-col items-end gap-0.5 px-3 py-2"
            >
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
      <aside className="hidden w-40 shrink-0 xl:block">
        <TableOfContents items={toc} />
      </aside>
    </div>
  );
}

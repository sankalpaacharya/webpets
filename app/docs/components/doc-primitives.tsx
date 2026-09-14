import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  );
}

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-6 text-muted-foreground">{children}</p>;
}

export type PropRow = {
  name: string;
  type: string;
  /** Omit when the prop is required. */
  defaultValue?: string;
  description: string;
};

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[160px]">Prop</TableHead>
            <TableHead className="w-[200px]">Type</TableHead>
            <TableHead className="w-[140px]">Default</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} className="hover:bg-transparent">
              <TableCell className="font-mono text-[13px]">{row.name}</TableCell>
              <TableCell className="font-mono text-[13px] text-muted-foreground">
                {row.type}
              </TableCell>
              <TableCell className="font-mono text-[13px] text-muted-foreground">
                {row.defaultValue ?? (
                  <Badge variant="secondary" className="font-body">
                    Required
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {row.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export type NavItem = { id: string; label: string };

export function DocNav({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-24">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        On This Page
      </p>
      <ul className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block py-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

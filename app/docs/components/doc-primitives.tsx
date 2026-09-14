import type { ReactNode } from "react";

import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground">
      {children}
    </code>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-6 text-muted-foreground">{children}</p>;
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-6 text-muted-foreground">
      <HugeiconsIcon icon={InformationCircleIcon} size={18} className="mt-0.5 shrink-0 text-foreground" />
      <div>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Structure
// ---------------------------------------------------------------------------

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="ml-3 space-y-8 border-l border-border pl-8">{children}</ol>;
}

type StepProps = {
  number: number;
  title: string;
  children: ReactNode;
};

export function Step({ number, title, children }: StepProps) {
  return (
    <li className="relative space-y-3">
      <span
        aria-hidden
        className="absolute -left-[calc(2rem+0.5px)] top-0 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background font-mono text-xs"
      >
        {number}
      </span>
      <h3 className="text-base font-semibold leading-6">{title}</h3>
      {children}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

export type Feature = {
  icon: IconSvgElement;
  title: string;
  body: string;
};

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {features.map((feature) => (
        <li key={feature.title} className="flex gap-3 rounded-lg border border-border p-4">
          <HugeiconsIcon icon={feature.icon} size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">{feature.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{feature.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export type Stat = { value: string; label: string };

export function Stats({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-3 divide-x divide-border rounded-lg border border-border">
      {stats.map((stat) => (
        <div key={stat.label} className="px-4 py-3">
          <dd className="font-mono text-xl tabular-nums">{stat.value}</dd>
          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export type PropRow = {
  name: string;
  type: string;
  /** Omit when the prop is required. */
  defaultValue?: string;
  description: string;
};

type PropsTableProps = {
  rows: PropRow[];
  /** Override the column headings, e.g. when the table lists modes, not props. */
  columns?: Partial<Record<"name" | "type" | "defaultValue" | "description", string>>;
};

const DEFAULT_COLUMNS = {
  name: "Prop",
  type: "Type",
  defaultValue: "Default",
  description: "Description",
};

export function PropsTable({ rows, columns }: PropsTableProps) {
  const heading = { ...DEFAULT_COLUMNS, ...columns };
  const mono = "font-mono text-[13px]";

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[140px]">{heading.name}</TableHead>
            <TableHead className="w-[180px]">{heading.type}</TableHead>
            <TableHead className="w-[130px]">{heading.defaultValue}</TableHead>
            <TableHead>{heading.description}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} className="hover:bg-transparent">
              <TableCell className={mono}>{row.name}</TableCell>
              <TableCell className={`${mono} whitespace-normal text-muted-foreground`}>{row.type}</TableCell>
              <TableCell className={`${mono} text-muted-foreground`}>
                {row.defaultValue ?? (
                  <Badge variant="secondary" className="font-body">
                    Required
                  </Badge>
                )}
              </TableCell>
              <TableCell className="whitespace-normal text-sm leading-5 text-muted-foreground">
                {row.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

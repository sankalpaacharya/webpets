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

export function Note({ children }: { children: ReactNode }) {
  return <p className="text-sm leading-6 text-muted-foreground">{children}</p>;
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

import type { ReactNode } from "react";

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1 py-0.5 text-[0.85em] text-foreground">
      {children}
    </code>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <h2 className="text-xl sm:text-2xl">
        <a href={`#${id}`} className="underline-offset-4 hover:underline">
          {title}
        </a>
      </h2>
      {children}
    </section>
  );
}

export type PropRow = {
  name: string;
  type: string;
  defaultValue: string;
  description: ReactNode;
};

export function PropList({ rows }: { rows: PropRow[] }) {
  return (
    <dl className="divide-y divide-border/70 rounded-2xl border border-border">
      {rows.map((row) => (
        <div key={row.name} className="space-y-1.5 px-4 py-3">
          <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs">
            <span className="text-foreground">{row.name}</span>
            <span className="text-muted-foreground">{row.type}</span>
            <span className="text-muted-foreground">
              default: {row.defaultValue}
            </span>
          </dt>
          <dd className="text-sm text-muted-foreground">{row.description}</dd>
        </div>
      ))}
    </dl>
  );
}

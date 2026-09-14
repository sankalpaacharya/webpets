import Link from "next/link";

import { Button } from "@/components/ui/button";

import { DocPage } from "./components/doc-page";
import { Note, Section } from "./components/doc-primitives";
import { PetPreview } from "./components/pet-preview";

const HERO = `import { WebPet } from "@/components/web-pet";

<WebPet animal="fox" color="white" hoverMessage="hello" />`;

const STEPS = [
  { title: "Install", body: "One shadcn command adds the component.", href: "/docs/installation" },
  { title: "Add GIFs", body: "Download an animal from the playground into public.", href: "/docs/installation" },
  { title: "Render", body: "Drop <WebPet /> in a layout. Done.", href: "/docs/usage" },
];

export default function IntroductionPage() {
  return (
    <DocPage href="/docs">
      <PetPreview
        pet={{ animal: "fox", color: "white", hoverMessage: "hello" }}
        code={HERO}
      />

      <Section id="quick-start" title="Quick Start">
        <ol className="grid gap-3 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-lg border border-border p-4">
              <p className="text-xs font-medium text-muted-foreground">Step {i + 1}</p>
              <p className="mt-1 font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/docs/installation">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/playground">Open Playground</Link>
          </Button>
        </div>
      </Section>

      <Section id="what" title="What You Get">
        <Note>
          One React component, no dependencies beyond React. 22 animals with
          multiple colors. Wander, follow the cursor, react on hover, and speak.
          Pointer events pass through, so it never blocks a click.
        </Note>
      </Section>
    </DocPage>
  );
}

import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";

import { DocPage } from "../components/doc-page";
import { Code, Note, PropsTable, Section } from "../components/doc-primitives";
import type { PropRow } from "../components/doc-primitives";

export const metadata: Metadata = { title: "Behavior" };

const EXAMPLE = `<WebPet
  animal="turtle"
  color="orange"
  behavior={{
    hoverAction: "with_ball",
    idlePauseMs: { min: 3000, max: 6000 },
    movementActions: [{ name: "walk", speedMultiplier: 1 }],
  }}
/>`;

const MODES: PropRow[] = [
  { name: "hover", type: "cursor near", defaultValue: "—", description: "Stops and plays hoverAction. The bubble shows." },
  { name: "idle", type: "at target", defaultValue: "—", description: "Rests and cycles idleActions." },
  { name: "walking", type: "otherwise", defaultValue: "—", description: "Moves toward the target with a movementAction." },
];

const KNOBS: PropRow[] = [
  { name: "hoverAction", type: "string", defaultValue: '"swipe"', description: "Action played while the cursor is near." },
  { name: "hoverDist", type: "number", defaultValue: "50", description: "Radius in px that counts as near." },
  { name: "idleDist", type: "number", defaultValue: "48", description: "Distance from target at which the pet stops." },
  { name: "idlePauseMs", type: "{ min, max }", defaultValue: "{ 1500, 2200 }", description: "Rest between walks." },
  { name: "idleActions", type: "IdleAction[]", defaultValue: "idle, swipe", description: "Poses cycled while resting." },
  { name: "movementActions", type: "MovementAction[]", defaultValue: "walk, walk_fast, run", description: "One is picked per walk." },
  { name: "actions", type: "string[]", defaultValue: "from manifest", description: "GIFs the animal has. Others fall back." },
];

export default function BehaviorPage() {
  return (
    <DocPage href="/docs/behavior">
      <Section id="modes" title="Modes">
        <Note>
          The pet ticks 8 times a second and is always in one of 3 modes,
          checked in this order.
        </Note>
        <PropsTable rows={MODES} columns={{ name: "Mode", type: "When" }} />
      </Section>

      <Section id="knobs" title="Tuning">
        <Note>
          Pass any of these in <Code>behavior</Code>. Omit the rest.
        </Note>
        <CodeBlock code={EXAMPLE} lang="tsx" />
        <PropsTable rows={KNOBS} />
      </Section>
    </DocPage>
  );
}

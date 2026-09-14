import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";

import { DocPage } from "../components/doc-page";
import { Note, PropsTable, Section } from "../components/doc-primitives";
import type { PropRow } from "../components/doc-primitives";

export const metadata: Metadata = { title: "Props" };

const SIGNATURE = `type WebPetProps = {
  animal: string;
  color?: string;
  position?: "fixed" | "absolute";
  speed?: number;
  scale?: number;
  followMouse?: boolean;
  hoverMessage?: string;
  speech?: { maxWidth?: number; offsetY?: number };
  mediaBaseUrl?: string;
  zIndex?: number;
  style?: CSSProperties;
  behavior?: Partial<PetBehavior>;
};`;

const PROPS: PropRow[] = [
  { name: "animal", type: "string", description: "Folder name under media." },
  { name: "color", type: "string", defaultValue: "first available", description: "Color variant." },
  { name: "position", type: '"fixed" | "absolute"', defaultValue: '"fixed"', description: "Roam the viewport or the nearest positioned parent." },
  { name: "speed", type: "number", defaultValue: "per animal", description: "Pixels per tick. 8 ticks per second." },
  { name: "scale", type: "number", defaultValue: "0.5", description: "Multiplier on the 100 px sprite." },
  { name: "followMouse", type: "boolean", defaultValue: "false", description: "Chase the cursor instead of wandering." },
  { name: "hoverMessage", type: "string", defaultValue: "—", description: "Speech bubble shown near the cursor." },
  { name: "speech", type: "{ maxWidth?, offsetY? }", defaultValue: "{ 160, 0 }", description: "Bubble width and vertical nudge." },
  { name: "mediaBaseUrl", type: "string", defaultValue: '"/media"', description: "Where the GIF folders are served from." },
  { name: "zIndex", type: "number", defaultValue: "9999", description: "Stacking order." },
  { name: "style", type: "CSSProperties", defaultValue: "—", description: "Merged onto the wrapper." },
  { name: "behavior", type: "Partial<PetBehavior>", defaultValue: "—", description: "Tuning knobs. See Behavior." },
];

export default function PropsPage() {
  return (
    <DocPage href="/docs/props">
      <Section id="signature" title="Signature">
        <Note>Only <code className="font-mono">animal</code> is required. Everything else has a sensible default.</Note>
        <CodeBlock code={SIGNATURE} lang="tsx" title="components/web-pet.tsx" />
      </Section>
      <Section id="reference" title="Reference">
        <PropsTable rows={PROPS} />
      </Section>
    </DocPage>
  );
}

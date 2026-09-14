import Link from "next/link";

import {
  CursorPointer01Icon,
  Message01Icon,
  Route01Icon,
  Touch01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import { PET_MANIFEST } from "@/lib/pet-manifest";

import { DocPage } from "./components/doc-page";
import { FeatureGrid, Section, Stats } from "./components/doc-primitives";
import type { Feature, Stat } from "./components/doc-primitives";
import { PetPreview } from "./components/pet-preview";

const HERO = `import { WebPet } from "@/components/web-pet";

<WebPet animal="fox" color="white" hoverMessage="hello" />`;

const FEATURES: Feature[] = [
  { icon: Route01Icon, title: "Wanders", body: "Picks a spot, walks there, rests, repeats." },
  { icon: CursorPointer01Icon, title: "Follows the cursor", body: "One prop turns wandering into chasing." },
  { icon: Touch01Icon, title: "Reacts on hover", body: "Plays an action when the cursor gets close." },
  { icon: Message01Icon, title: "Speaks", body: "Optional speech bubble with your message." },
];

const animals = Object.values(PET_MANIFEST);
const STATS: Stat[] = [
  { value: String(animals.length), label: "animals" },
  { value: String(animals.reduce((n, a) => n + a.colors.length, 0)), label: "color variants" },
  { value: "0", label: "dependencies" },
];

export default function IntroductionPage() {
  return (
    <DocPage href="/docs">
      <PetPreview
        pet={{ animal: "fox", color: "white", hoverMessage: "hello" }}
        code={HERO}
      />

      <Section id="features" title="What It Does">
        <FeatureGrid features={FEATURES} />
        <Stats stats={STATS} />
      </Section>

      <Section id="next" title="Next Steps">
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/docs/installation">Install</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/playground">Open Playground</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/docs/animals">Browse Animals</Link>
          </Button>
        </div>
      </Section>
    </DocPage>
  );
}

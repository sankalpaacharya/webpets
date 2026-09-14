import Link from "next/link";

import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INSTALL_COMMANDS, PACKAGE_MANAGERS } from "@/lib/install-commands";

import {
  Code,
  DocNav,
  Note,
  PropsTable,
  Section,
} from "./components/doc-primitives";
import type { NavItem, PropRow } from "./components/doc-primitives";

const USAGE = `import { WebPet } from "@/components/web-pet";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <WebPet animal="dog" color="red" hoverMessage="hi" />
    </>
  );
}`;

const TREE = `public/
└── media/
    └── dog/
        ├── red_idle_8fps.gif
        ├── red_walk_8fps.gif
        └── …`;

const NAMING = `public/media/<animal>/<color>_<action>_8fps.gif`;

const NAV: NavItem[] = [
  { id: "install", label: "Install" },
  { id: "usage", label: "Usage" },
  { id: "props", label: "Props" },
  { id: "behavior", label: "Behavior" },
  { id: "custom", label: "Custom Animals" },
];

const PROPS: PropRow[] = [
  { name: "animal", type: "string", description: "Folder name under media." },
  { name: "color", type: "string", defaultValue: "first available", description: "Color variant." },
  { name: "position", type: '"fixed" | "absolute"', defaultValue: '"fixed"', description: "Roam the viewport or the nearest positioned parent." },
  { name: "speed", type: "number", defaultValue: "per animal", description: "Pixels per tick. 8 ticks per second." },
  { name: "scale", type: "number", defaultValue: "0.5", description: "Multiplier on the 100 px sprite." },
  { name: "followMouse", type: "boolean", defaultValue: "false", description: "Chase the cursor instead of wandering." },
  { name: "hoverMessage", type: "string", defaultValue: "—", description: "Speech bubble shown near the cursor." },
  { name: "mediaBaseUrl", type: "string", defaultValue: '"/media"', description: "Where the GIF folders are served from." },
  { name: "zIndex", type: "number", defaultValue: "9999", description: "Stacking order." },
  { name: "style", type: "CSSProperties", defaultValue: "—", description: "Merged onto the wrapper." },
  { name: "behavior", type: "Partial<PetBehavior>", defaultValue: "—", description: "Tuning knobs. See Behavior." },
];

const BEHAVIOR: PropRow[] = [
  { name: "hoverAction", type: "string", defaultValue: '"swipe"', description: "Action played while the cursor is near." },
  { name: "hoverDist", type: "number", defaultValue: "50", description: "Radius in px that counts as near." },
  { name: "idleDist", type: "number", defaultValue: "48", description: "Distance from target at which the pet stops." },
  { name: "idlePauseMs", type: "{ min, max }", defaultValue: "{ 1500, 2200 }", description: "Rest between walks." },
  { name: "idleActions", type: "IdleAction[]", defaultValue: "idle, swipe", description: "Poses cycled while resting." },
  { name: "movementActions", type: "MovementAction[]", defaultValue: "walk, walk_fast, run", description: "One is picked per walk." },
  { name: "actions", type: "string[]", defaultValue: "from manifest", description: "GIFs the animal has. Others fall back." },
];

export default function DocsPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-background font-body text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <header className="max-w-2xl space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">WebPet</h1>
          <p className="text-base text-muted-foreground">
            A pixel pet that walks along the bottom of your page.
          </p>
        </header>

        <Separator className="my-10" />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div className="space-y-14">
            <Section id="install" title="Install">
              <Tabs defaultValue="bun">
                <TabsList>
                  {PACKAGE_MANAGERS.map((pm) => (
                    <TabsTrigger key={pm} value={pm}>
                      {pm}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {PACKAGE_MANAGERS.map((pm) => (
                  <TabsContent key={pm} value={pm} className="mt-3">
                    <CodeBlock code={INSTALL_COMMANDS[pm]} lang="bash" />
                  </TabsContent>
                ))}
              </Tabs>
              <Note>
                Then download the animal&rsquo;s GIFs from the playground and unzip
                them into <Code>public</Code>.
              </Note>
              <CodeBlock code={TREE} lang="bash" />
              <Button asChild variant="outline" size="sm">
                <Link href="/playground">Open Playground</Link>
              </Button>
            </Section>

            <Section id="usage" title="Usage">
              <CodeBlock code={USAGE} lang="tsx" title="app/layout.tsx" />
              <Note>
                Use <Code>position=&quot;absolute&quot;</Code> inside a{" "}
                <Code>relative</Code> container to keep the pet in a box. The pet
                never captures clicks.
              </Note>
            </Section>

            <Section id="props" title="Props">
              <PropsTable rows={PROPS} />
            </Section>

            <Section id="behavior" title="Behavior">
              <Note>
                Each tick the pet is in one of 3 modes: <strong>hover</strong>{" "}
                when the cursor is near, <strong>idle</strong> when it has
                arrived, otherwise <strong>walking</strong>. Tune them through{" "}
                <Code>behavior</Code>.
              </Note>
              <PropsTable rows={BEHAVIOR} />
            </Section>

            <Section id="custom" title="Custom Animals">
              <Note>
                Add a folder of 100&nbsp;×&nbsp;100 GIFs named by color and
                action, then pass the folder name as <Code>animal</Code>.
                At minimum ship <Code>idle</Code> and <Code>walk</Code>.
              </Note>
              <CodeBlock code={NAMING} lang="bash" />
            </Section>
          </div>

          <aside className="hidden lg:block">
            <DocNav items={NAV} />
          </aside>
        </div>
      </div>
    </div>
  );
}

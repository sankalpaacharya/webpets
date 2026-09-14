import Link from "next/link";
import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INSTALL_COMMANDS, PACKAGE_MANAGERS } from "@/lib/install-commands";

import { DocPage } from "../components/doc-page";
import { Code, Note, Section } from "../components/doc-primitives";

export const metadata: Metadata = { title: "Installation" };

const TREE = `public/
└── media/
    └── dog/
        ├── red_idle_8fps.gif
        ├── red_walk_8fps.gif
        └── …`;

export default function InstallationPage() {
  return (
    <DocPage href="/docs/installation">
      <Section id="component" title="1. Add the Component">
        <Note>
          Installs <Code>components/web-pet.tsx</Code>, the engine, and the
          animal manifest through the shadcn registry.
        </Note>
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
      </Section>

      <Section id="assets" title="2. Add the GIFs">
        <Note>
          Pick an animal and color in the playground, download the zip, and
          unzip it into <Code>public</Code>.
        </Note>
        <CodeBlock code={TREE} lang="bash" />
        <Button asChild variant="outline" size="sm">
          <Link href="/playground">Open Playground</Link>
        </Button>
      </Section>
    </DocPage>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INSTALL_COMMANDS, PACKAGE_MANAGERS } from "@/lib/install-commands";

import { DocPage } from "../components/doc-page";
import { Callout, Code, Note, Section, Step, Steps } from "../components/doc-primitives";

export const metadata: Metadata = { title: "Installation" };

const FILES = [
  { path: "components/web-pet.tsx", kind: "component" },
  { path: "lib/web-pet-engine.ts", kind: "lib" },
  { path: "lib/pet-manifest.ts", kind: "lib" },
];

const TREE = `public/
└── media/
    └── dog/
        ├── red_idle_8fps.gif
        ├── red_walk_8fps.gif
        └── …`;

const RENDER = `import { WebPet } from "@/components/web-pet";

<WebPet animal="dog" color="red" />`;

export default function InstallationPage() {
  return (
    <DocPage href="/docs/installation">
      <Section id="steps" title="Setup">
        <Steps>
          <Step number={1} title="Add the component">
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
            <ul className="divide-y divide-border rounded-lg border border-border">
              {FILES.map((file) => (
                <li key={file.path} className="flex items-center justify-between px-3 py-2">
                  <span className="font-mono text-[13px]">{file.path}</span>
                  <Badge variant="outline">{file.kind}</Badge>
                </li>
              ))}
            </ul>
          </Step>

          <Step number={2} title="Add the GIFs">
            <Note>
              Pick an animal and color in the playground and download the zip.
              Unzip it into <Code>public</Code>.
            </Note>
            <CodeBlock code={TREE} lang="bash" />
            <Button asChild variant="outline" size="sm">
              <Link href="/playground">Open Playground</Link>
            </Button>
          </Step>

          <Step number={3} title="Render it">
            <CodeBlock code={RENDER} lang="tsx" />
          </Step>
        </Steps>
      </Section>

      <Section id="notes" title="Good to Know">
        <Callout>
          The GIFs are not part of the registry item, so the install is small
          and you only ship the animals you use. Set <Code>mediaBaseUrl</Code>{" "}
          if they live on a CDN instead of <Code>public</Code>.
        </Callout>
      </Section>
    </DocPage>
  );
}

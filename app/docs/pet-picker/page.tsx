import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PACKAGE_MANAGERS, REGISTRY_ITEM_URL } from "@/lib/install-commands";

import { DocPage } from "../components/doc-page";
import { Code, Note, PropsTable, Section } from "../components/doc-primitives";
import type { PropRow } from "../components/doc-primitives";
import { PickerPreview } from "./picker-preview";

export const metadata: Metadata = { title: "Pet Picker" };

const PICKER_URL = REGISTRY_ITEM_URL.replace("web-pet.json", "pet-picker.json");
const INSTALL: Record<(typeof PACKAGE_MANAGERS)[number], string> = {
  pnpm: `pnpm dlx shadcn@latest add ${PICKER_URL}`,
  npm: `npx shadcn@latest add ${PICKER_URL}`,
  yarn: `yarn dlx shadcn@latest add ${PICKER_URL}`,
  bun: `bunx --bun shadcn@latest add ${PICKER_URL}`,
};

const USAGE = `import { PetPicker } from "@/components/pet-picker";

<PetPicker defaultAnimal="deno" hoverMessage="click me" />`;

const CURATED = `<PetPicker
  animals={["deno", "fox", "chicken", "totoro"]}
  colors={{ fox: "white" }}
  defaultAnimal={null}
  storageKey="my-site:pet"
/>`;

const PROPS: PropRow[] = [
  { name: "animals", type: "string[]", defaultValue: "all", description: "Animals offered in the menu." },
  { name: "colors", type: "Record<string, string>", defaultValue: "first color", description: "Color to use per animal." },
  { name: "defaultAnimal", type: "string | null", defaultValue: "animals[0]", description: "Shown before a choice is made. null shows only a small trigger." },
  { name: "storageKey", type: "string | null", defaultValue: '"webpet:animal"', description: "Where the choice is saved in localStorage. null disables it." },
  { name: "onChange", type: "(animal: string | null) => void", defaultValue: "—", description: "Fires on every pick." },
  { name: "…WebPetProps", type: "", defaultValue: "—", description: "Everything else is passed to WebPet." },
];

export default function PetPickerPage() {
  return (
    <DocPage href="/docs/pet-picker">
      <PickerPreview />

      <Section id="install" title="Install">
        <Note>
          Pulls in <Code>web-pet</Code> and the shadcn Popover if you do not
          have them yet.
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
              <CodeBlock code={INSTALL[pm]} lang="bash" />
            </TabsContent>
          ))}
        </Tabs>
      </Section>

      <Section id="usage" title="Usage">
        <CodeBlock code={USAGE} lang="tsx" />
        <Note>
          The pet is clickable. The menu lists every animal in the manifest,
          the choice is saved in localStorage, and <Code>None</Code> hides the
          pet behind a small trigger. Ship the GIFs for every animal you offer.
        </Note>
        <CodeBlock code={CURATED} lang="tsx" />
      </Section>

      <Section id="props" title="Props">
        <PropsTable rows={PROPS} />
      </Section>
    </DocPage>
  );
}

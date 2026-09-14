import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";

import { DocPage } from "../components/doc-page";
import { Code, Note, Section } from "../components/doc-primitives";
import { PetPreview } from "../components/pet-preview";

export const metadata: Metadata = { title: "Usage" };

const BASIC = `import { WebPet } from "@/components/web-pet";

<WebPet animal="dog" color="red" hoverMessage="hi" />`;

const LAYOUT = `import { WebPet } from "@/components/web-pet";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <WebPet animal="fox" color="white" />
      </body>
    </html>
  );
}`;

const CONTAINED = `<div className="relative h-64 overflow-hidden">
  <WebPet animal="chicken" color="brown" position="absolute" />
</div>`;

export default function UsagePage() {
  return (
    <DocPage href="/docs/usage">
      <Section id="basic" title="Basic">
        <PetPreview
          pet={{ animal: "dog", color: "red", hoverMessage: "hi" }}
          code={BASIC}
        />
        <Note>Move the cursor over the dog to see the hover action and bubble.</Note>
      </Section>

      <Section id="page" title="Whole Page">
        <Note>
          The default <Code>position=&quot;fixed&quot;</Code> walks along the
          bottom of the viewport. Put it in your root layout once.
        </Note>
        <CodeBlock code={LAYOUT} lang="tsx" title="app/layout.tsx" />
      </Section>

      <Section id="contained" title="Inside a Box">
        <Note>
          Use <Code>position=&quot;absolute&quot;</Code> inside a{" "}
          <Code>relative</Code> container. The pet roams that box instead.
        </Note>
        <CodeBlock code={CONTAINED} lang="tsx" />
      </Section>
    </DocPage>
  );
}

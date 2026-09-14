import type { Metadata } from "next";

import { CodeBlock } from "@/components/code-block";

import { DocPage } from "../components/doc-page";
import { Code, Note, Section } from "../components/doc-primitives";

export const metadata: Metadata = { title: "Custom Animals" };

const NAMING = `public/media/<animal>/<color>_<action>_8fps.gif

public/media/robot/blue_idle_8fps.gif
public/media/robot/blue_walk_8fps.gif
public/media/robot/blue_swipe_8fps.gif`;

const USE = `<WebPet
  animal="robot"
  color="blue"
  behavior={{ actions: ["idle", "walk", "swipe"] }}
/>`;

export default function CustomAnimalsPage() {
  return (
    <DocPage href="/docs/custom-animals">
      <Section id="files" title="Files">
        <Note>
          Add a folder of 100&nbsp;×&nbsp;100 GIFs named by color and action.
          Ship at least <Code>idle</Code> and <Code>walk</Code>.
        </Note>
        <CodeBlock code={NAMING} lang="bash" />
      </Section>

      <Section id="use" title="Use It">
        <Note>
          Pass <Code>behavior.actions</Code> so the pet only requests GIFs that
          exist. Actions it lacks fall back to the first one.
        </Note>
        <CodeBlock code={USE} lang="tsx" />
      </Section>

      <Section id="repo" title="In This Repo">
        <Note>
          Put the folder in <Code>public/media</Code> with an{" "}
          <Code>icon.png</Code> and run <Code>bun run manifest</Code>. The
          playground and the Animals page pick it up.
        </Note>
      </Section>
    </DocPage>
  );
}

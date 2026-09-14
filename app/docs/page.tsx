import Link from "next/link";

import { CodeBlock } from "@/components/code-block";

import {
  Code,
  PropList,
  Prose,
  Section,
} from "./components/doc-primitives";
import type { PropRow } from "./components/doc-primitives";

const INSTALL = `bunx --bun shadcn@latest add https://webpets-flame.vercel.app/r/web-pet.json`;

const TREE = `public/
└─ media/
   └─ dog/
      ├─ red_idle_8fps.gif
      ├─ red_walk_8fps.gif
      ├─ red_walk_fast_8fps.gif
      ├─ red_run_8fps.gif
      ├─ red_swipe_8fps.gif
      └─ red_with_ball_8fps.gif`;

const USAGE = `import { WebPet } from "@/components/web-pet";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <WebPet animal="dog" color="red" />
    </>
  );
}`;

const CONTAINED = `<div className="relative h-64 overflow-hidden">
  <WebPet animal="chicken" color="brown" position="absolute" />
</div>`;

const HOVER = `<WebPet
  animal="cockatiel"
  color="gray"
  hoverMessage="hi, i live here now"
  speech={{ maxWidth: 200 }}
/>`;

const BEHAVIOR = `<WebPet
  animal="turtle"
  color="orange"
  behavior={{
    idleDist: 32,
    hoverAction: "with_ball",
    idlePauseMs: { min: 3000, max: 6000 },
    movementActions: [{ name: "walk", speedMultiplier: 1 }],
  }}
/>`;

const CDN = `<WebPet animal="fox" color="white" mediaBaseUrl="https://cdn.example.com/pets" />`;

const NAMING = `<color>_<action>_8fps.gif

# color and action may contain underscores
paint_beige_walk_fast_8fps.gif   ->  color: paint_beige, action: walk_fast`;

const PROPS: PropRow[] = [
  {
    name: "animal",
    type: "string",
    defaultValue: "required",
    description: (
      <>
        Folder name under <Code>media</Code>. Every animal in the{" "}
        <Link href="/playground" className="underline underline-offset-4">
          playground
        </Link>{" "}
        is a valid value.
      </>
    ),
  },
  {
    name: "color",
    type: "string",
    defaultValue: "first color the animal ships with",
    description: "Color variant. An unknown color falls back to the first one that exists, so you never get a blank sprite.",
  },
  {
    name: "position",
    type: '"fixed" | "absolute"',
    defaultValue: '"fixed"',
    description: "fixed roams the viewport. absolute roams its nearest positioned ancestor.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "per animal",
    description: "Pixels moved per tick. A tick is 125ms, so 4 means roughly 32px per second. Each animal has a tuned default; a snail is slower than a horse.",
  },
  {
    name: "scale",
    type: "number",
    defaultValue: "0.5",
    description: "GIFs are 100×100. 0.5 renders at 50px.",
  },
  {
    name: "followMouse",
    type: "boolean",
    defaultValue: "false",
    description: "Chase the cursor instead of wandering.",
  },
  {
    name: "hoverMessage",
    type: "string",
    defaultValue: "—",
    description: "Speech bubble shown while the cursor is near the pet. Empty means no bubble.",
  },
  {
    name: "speech",
    type: "{ maxWidth?, offsetY? }",
    defaultValue: "{ maxWidth: 160, offsetY: 0 }",
    description: "Bubble sizing. offsetY nudges it up (negative) or down (positive) in px.",
  },
  {
    name: "zIndex",
    type: "number",
    defaultValue: "9999",
    description: "Stacking. The pet never captures pointer events, so a high value is safe.",
  },
  {
    name: "style",
    type: "CSSProperties",
    defaultValue: "—",
    description: "Merged onto the wrapper. Useful for a bottom offset or a filter.",
  },
  {
    name: "mediaBaseUrl",
    type: "string",
    defaultValue: '"/media"',
    description: "Where the GIF folders live. Point it at a CDN if you don't want the files in public.",
  },
  {
    name: "behavior",
    type: "Partial<PetBehavior>",
    defaultValue: "—",
    description: "Tuning knobs. See the behavior section below.",
  },
];

const BEHAVIOR_ROWS: PropRow[] = [
  {
    name: "idleDist",
    type: "number",
    defaultValue: "48",
    description: "How close to its target (px) the pet gets before it stops.",
  },
  {
    name: "hoverAction",
    type: "string",
    defaultValue: '"swipe"',
    description: "Action played while the cursor is near.",
  },
  {
    name: "hoverDist",
    type: "number",
    defaultValue: "50",
    description: "Radius (px) from the sprite center that counts as near.",
  },
  {
    name: "idlePauseMs",
    type: "{ min, max }",
    defaultValue: "{ 1500, 2200 }",
    description: "How long it rests between walks. Picked at random in this range.",
  },
  {
    name: "actions",
    type: "string[]",
    defaultValue: "from manifest",
    description: "Actions the animal has GIFs for. Anything not in this list falls back to the first entry.",
  },
  {
    name: "idleActions",
    type: "{ name, baseDuration, extraDuration }[]",
    defaultValue: "idle, swipe",
    description: "Poses it cycles through while resting, each held for base plus a random slice of extra ms.",
  },
  {
    name: "movementActions",
    type: "{ name, speedMultiplier }[]",
    defaultValue: "walk, walk_fast, run",
    description: "One is picked per walk. Remove run if you want a calmer pet.",
  },
];

const TOC = [
  ["install", "Install"],
  ["use", "Use it"],
  ["props", "Props"],
  ["behavior", "How it behaves"],
  ["gotchas", "Things to know"],
  ["own", "Add your own animal"],
] as const;

export default function DocsPage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-background font-body text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-14 px-6 py-12">
        <header className="space-y-3">
          <p className="font-pixel text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Docs
          </p>
          <h1 className="font-pixel text-3xl sm:text-4xl">WebPet</h1>
          <p className="max-w-2xl text-[15px] leading-7 text-muted-foreground">
            One React component and a folder of GIFs. The pet walks along the
            bottom of whatever you put it in, rests, reacts when the cursor
            gets close, and never blocks a click.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 pt-2 text-sm text-muted-foreground">
            {TOC.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        <Section id="install" title="Install">
          <Prose>
            The component is distributed through the shadcn registry. It pulls
            in three files: the component, the engine, and a manifest of every
            animal and its colors.
          </Prose>
          <CodeBlock code={INSTALL} lang="bash" title="terminal" />
          <Prose>
            The GIFs are not part of the install. Pick an animal and color in
            the{" "}
            <Link href="/playground" className="underline underline-offset-4">
              playground
            </Link>
            , hit <span className="font-medium text-foreground">Download assets</span>, and
            unzip it into <Code>public</Code>. You end up with this:
          </Prose>
          <CodeBlock code={TREE} lang="bash" title="public/" />
          <Prose>
            Keep the <Code>media/&lt;animal&gt;</Code> layout. The file names
            are how the component finds each action. If you want the files
            somewhere else, see <Code>mediaBaseUrl</Code> below.
          </Prose>
        </Section>

        <Section id="use" title="Use it">
          <Prose>
            Drop it anywhere. With the default <Code>position=&quot;fixed&quot;</Code>{" "}
            it walks along the bottom of the viewport, so a layout file is the
            natural home.
          </Prose>
          <CodeBlock code={USAGE} lang="tsx" title="app/layout.tsx" />
          <Prose>
            To keep it inside a box, give the box <Code>position: relative</Code>{" "}
            and switch the pet to <Code>absolute</Code>. It then roams the width
            of that box and sits on its bottom edge.
          </Prose>
          <CodeBlock code={CONTAINED} lang="tsx" />
          <Prose>
            A speech bubble appears while the cursor is near the pet if you
            give it something to say.
          </Prose>
          <CodeBlock code={HOVER} lang="tsx" />
        </Section>

        <Section id="props" title="Props">
          <PropList rows={PROPS} />
        </Section>

        <Section id="behavior" title="How it behaves">
          <div className="space-y-3 text-[15px] leading-7 text-muted-foreground">
            <p>
              The pet ticks eight times a second. Each tick it does one of three
              things, in this order of priority:
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                <span className="font-medium text-foreground">Hover.</span> If the cursor is
                within <Code>hoverDist</Code> of the sprite center, it stops and
                plays <Code>hoverAction</Code>. The bubble shows here.
              </li>
              <li>
                <span className="font-medium text-foreground">Idle.</span> If it is within{" "}
                <Code>idleDist</Code> of its target, it rests and cycles through{" "}
                <Code>idleActions</Code>. After a wander it waits{" "}
                <Code>idlePauseMs</Code> before picking a new target.
              </li>
              <li>
                <span className="font-medium text-foreground">Walking.</span> Otherwise it
                moves <Code>speed × speedMultiplier</Code> px toward its target
                using one of the <Code>movementActions</Code>, and faces the
                way it is going.
              </li>
            </ol>
            <p>
              With <Code>followMouse</Code> the target is the cursor. Without
              it, the target is a random point 20 to 55 percent of the
              container width away, never closer than 16px to either edge.
            </p>
            <p>
              Everything above is tunable through <Code>behavior</Code>. Omit
              what you don&apos;t care about.
            </p>
          </div>
          <CodeBlock code={BEHAVIOR} lang="tsx" />
          <PropList rows={BEHAVIOR_ROWS} />
        </Section>

        <Section id="gotchas" title="Things to know">
          <ul className="list-disc space-y-3 pl-5 text-[15px] leading-7 text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                It never eats your clicks.
              </span>{" "}
              The wrapper has <Code>pointer-events: none</Code>. Hover is
              computed from the cursor position, not from DOM hover, which is
              why it still works.
            </li>
            <li>
              <span className="font-medium text-foreground">
                A blurred or transformed parent captures a fixed pet.
              </span>{" "}
              Browsers treat any ancestor with <Code>transform</Code>,{" "}
              <Code>filter</Code>, or <Code>backdrop-filter</Code> as the
              containing block for <Code>position: fixed</Code>. The pet
              notices and roams that element instead of the viewport. This site
              uses it on purpose to keep pets in the navbar.
            </li>
            <li>
              <span className="font-medium text-foreground">Missing GIFs fall back.</span>{" "}
              Some animals lack some actions. The manifest knows which, and an
              action that doesn&apos;t exist is swapped for one that does
              rather than requesting a 404.
            </li>
            <li>
              <span className="font-medium text-foreground">
                Reduced motion is respected.
              </span>{" "}
              With <Code>prefers-reduced-motion</Code> set, the pet is drawn
              once in its idle pose and does not move.
            </li>
            <li>
              <span className="font-medium text-foreground">Many pets are cheap.</span>{" "}
              They share one pointer listener and each runs a small pure
              step function per tick. Re-rendering the parent does not restart
              the animation, so passing inline objects to{" "}
              <Code>behavior</Code> is fine.
            </li>
            <li>
              <span className="font-medium text-foreground">Serve from anywhere.</span>{" "}
              Set <Code>mediaBaseUrl</Code> if the folders live on a CDN.
              Hover-bubble placement reads the GIF pixels, so a cross-origin
              host needs to send <Code>Access-Control-Allow-Origin</Code> or
              the bubble falls back to sitting on top of the sprite box.
            </li>
          </ul>
          <CodeBlock code={CDN} lang="tsx" />
        </Section>

        <Section id="own" title="Add your own animal">
          <Prose>
            Make a folder under <Code>media</Code>, drop in 100×100 GIFs named
            like this, and pass the folder name as <Code>animal</Code>.
          </Prose>
          <CodeBlock code={NAMING} lang="bash" title="naming" />
          <Prose>
            At minimum you want <Code>idle</Code> and <Code>walk</Code>. If you
            skip <Code>swipe</Code>, set <Code>hoverAction</Code> to something
            you do have, and pass <Code>behavior.actions</Code> so the
            component knows the full list. Animals not in the manifest default
            to speed 4.5.
          </Prose>
          <Prose>
            If you are working in this repo instead, put the folder in{" "}
            <Code>public/media</Code> with an <Code>icon.png</Code> and run{" "}
            <Code>bun run manifest</Code>. That regenerates the manifest, and
            the playground picks the animal up.
          </Prose>
        </Section>

        <footer className="border-t border-border/60 pt-6 text-[15px] text-muted-foreground">
          Asset licenses are listed on the{" "}
          <Link href="/credits" className="underline underline-offset-4">
            credits page
          </Link>
          .
        </footer>
      </div>
    </div>
  );
}

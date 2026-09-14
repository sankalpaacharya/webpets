/**
 * Scans `public/media` and writes `lib/pet-manifest.ts`.
 *
 * Run with: `bun run manifest`
 *
 * The manifest is what `<WebPet>` uses to know which colors and actions each
 * animal actually ships with, so it never requests a GIF that does not exist.
 * Speeds cannot be derived from files, so they are tuned by hand below.
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { parsePetGifName } from "../lib/pet-media";

/** Hand-tuned base movement speed (px per tick) per animal. */
const SPEEDS: Record<string, number> = {
  bear: 3.9,
  cat: 4.6,
  chicken: 4.3,
  clippy: 3.2,
  cockatiel: 4.0,
  crab: 3.4,
  deno: 4.8,
  dog: 5.5,
  fox: 5.2,
  horse: 5.8,
  mod: 4.0,
  monkey: 4.7,
  morph: 4.0,
  panda: 3.6,
  rat: 4.9,
  rocky: 2.8,
  "rubber-duck": 3.0,
  skeleton: 4.4,
  snail: 1.4,
  snake: 3.7,
  totoro: 3.1,
  turtle: 2.2,
  vampire: 3.8,
  zappy: 5.0,
};

const DEFAULT_SPEED = 4.5;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA_ROOT = path.join(ROOT, "public", "media");
const OUT_FILE = path.join(ROOT, "lib", "pet-manifest.ts");

type Entry = {
  speed: number;
  colors: string[];
  actions: string[];
};

async function scan(): Promise<Record<string, Entry>> {
  const dirs = await fs.readdir(MEDIA_ROOT, { withFileTypes: true });
  const manifest: Record<string, Entry> = {};

  for (const dir of dirs) {
    if (!dir.isDirectory() || dir.name.startsWith(".")) continue;
    const folder = path.join(MEDIA_ROOT, dir.name);
    const files = await fs.readdir(folder);
    if (!files.includes("icon.png")) continue;

    const actionsByColor = new Map<string, Set<string>>();
    for (const file of files) {
      const parsed = parsePetGifName(file);
      if (!parsed) continue;
      const set = actionsByColor.get(parsed.color) ?? new Set<string>();
      set.add(parsed.action);
      actionsByColor.set(parsed.color, set);
    }
    if (actionsByColor.size === 0) continue;

    // Only keep actions that every color of this animal provides, so a
    // random action pick can never 404 regardless of the chosen color.
    const colors = [...actionsByColor.keys()].sort();
    const [first, ...rest] = colors.map((c) => actionsByColor.get(c)!);
    const shared = [...first].filter((a) => rest.every((s) => s.has(a))).sort();

    manifest[dir.name] = {
      speed: SPEEDS[dir.name] ?? DEFAULT_SPEED,
      colors,
      actions: shared,
    };
  }

  return Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  );
}

function render(manifest: Record<string, Entry>): string {
  const body = JSON.stringify(manifest, null, 2);
  return `// GENERATED FILE - DO NOT EDIT.
// Regenerate with \`bun run manifest\` after adding or removing media.

export type PetManifestEntry = {
  /** Base movement speed in px per animation tick. */
  speed: number;
  /** Color variants available under public/media/<animal>. */
  colors: string[];
  /** Actions available for every color of this animal. */
  actions: string[];
};

export const PET_MANIFEST: Record<string, PetManifestEntry> = ${body};
`;
}

const manifest = await scan();
await fs.writeFile(OUT_FILE, render(manifest));

const unknownSpeeds = Object.keys(manifest).filter((name) => !(name in SPEEDS));
console.log(`Wrote ${Object.keys(manifest).length} animals to ${path.relative(ROOT, OUT_FILE)}`);
if (unknownSpeeds.length > 0) {
  console.log(`Using default speed for: ${unknownSpeeds.join(", ")}`);
}

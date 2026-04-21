import "server-only";

import fs from "fs/promises";
import type { Dirent } from "fs";
import path from "path";

import type {
  GeneratedAnimalVariant,
  GeneratedAnimalWithVariants,
} from "./types";

const GENERATED_ROOT = path.join(process.cwd(), "public", "generated");
const MEDIA_ROOT = path.join(process.cwd(), "public", "media");

async function getLogoUrl(animalName: string) {
  const logoPath = path.join(MEDIA_ROOT, animalName, "icon.png");
  try {
    const stat = await fs.stat(logoPath);
    if (!stat.isFile()) return null;
    return `/media/${animalName}/icon.png`;
  } catch {
    return null;
  }
}

function parseGeneratedGifVariant(fileName: string, animalName: string) {
  if (!fileName.toLowerCase().endsWith(".gif")) return null;
  const baseName = fileName.slice(0, -4);
  const parts = baseName.split("_");
  if (parts.length < 3) return null;

  const fpsPart = parts[parts.length - 1];
  const fpsMatch = fpsPart.match(/^(\d+)fps$/i);
  if (!fpsMatch) return null;

  const variant = parts[0];
  const action = parts.slice(1, -1).join("_");
  if (!variant || !action) return null;

  return {
    variant,
    action,
    fps: Number(fpsMatch[1]),
    gifUrl: `/generated/${animalName}/${fileName}`,
    fileName,
  } satisfies GeneratedAnimalVariant;
}

export async function getGeneratedAnimalsWithVariants(): Promise<
  GeneratedAnimalWithVariants[]
> {
  "use cache";
  let entries: Dirent[] = [];
  try {
    entries = await fs.readdir(GENERATED_ROOT, { withFileTypes: true });
  } catch {
    return [];
  }

  const animals = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map(async (entry) => {
        const folderPath = path.join(GENERATED_ROOT, entry.name);
        const files = await fs.readdir(folderPath, { withFileTypes: true });
        const variants = files
          .filter((file) => file.isFile())
          .map((file) => parseGeneratedGifVariant(file.name, entry.name))
          .filter(
            (variant): variant is GeneratedAnimalVariant => Boolean(variant),
          )
          .sort((a, b) =>
            a.variant === b.variant
              ? a.action.localeCompare(b.action)
              : a.variant.localeCompare(b.variant),
          );

        if (variants.length === 0) return null;

        return {
          name: entry.name,
          logoUrl: await getLogoUrl(entry.name),
          variants,
        } satisfies GeneratedAnimalWithVariants;
      }),
  );

  return animals
    .filter((animal): animal is GeneratedAnimalWithVariants => Boolean(animal))
    .sort((a, b) => a.name.localeCompare(b.name));
}

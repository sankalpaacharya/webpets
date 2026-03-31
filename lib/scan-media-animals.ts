import "server-only";

import fs from "fs/promises";
import path from "path";

import type {
  MediaAnimal,
  MediaAnimalVariant,
  MediaAnimalWithVariants,
} from "./types";

async function hasLogo(folderPath: string) {
  const logoPath = path.join(folderPath, "icon.png");
  try {
    const stat = await fs.stat(logoPath);
    return stat.isFile();
  } catch {
    return false;
  }
}

function parseGifVariant(fileName: string, animalName: string) {
  if (!fileName.toLowerCase().endsWith(".gif")) return null;
  const baseName = fileName.slice(0, -4);
  const parts = baseName.split("_");
  if (parts.length < 3) return null;

  const fpsPart = parts[parts.length - 1];
  const fpsMatch = fpsPart.match(/^(\d+)fps$/i);
  if (!fpsMatch) return null;

  const color = parts[0];
  const action = parts.slice(1, -1).join("_");
  if (!color || !action) return null;

  return {
    color,
    action,
    fps: Number(fpsMatch[1]),
    gifUrl: `/media/${animalName}/${fileName}`,
  } satisfies MediaAnimalVariant;
}

export async function getMediaAnimals(): Promise<MediaAnimal[]> {
  "use cache";
  const mediaRoot = path.join(process.cwd(), "public", "media");
  const entries = await fs.readdir(mediaRoot, { withFileTypes: true });

  const animals = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map(async (entry) => {
        const folderPath = path.join(mediaRoot, entry.name);
        if (!(await hasLogo(folderPath))) return null;
        return {
          name: entry.name,
          logoUrl: `/media/${entry.name}/icon.png`,
        } satisfies MediaAnimal;
      }),
  );

  return animals
    .filter((animal): animal is MediaAnimal => Boolean(animal))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getMediaAnimalsWithVariants(): Promise<
  MediaAnimalWithVariants[]
> {
  "use cache";
  const mediaRoot = path.join(process.cwd(), "public", "media");
  const entries = await fs.readdir(mediaRoot, { withFileTypes: true });

  const animals = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map(async (entry) => {
        const folderPath = path.join(mediaRoot, entry.name);
        if (!(await hasLogo(folderPath))) return null;

        const files = await fs.readdir(folderPath, { withFileTypes: true });
        const variants = files
          .filter((file) => file.isFile())
          .map((file) => parseGifVariant(file.name, entry.name))
          .filter((variant): variant is MediaAnimalVariant => Boolean(variant))
          .sort((a, b) =>
            a.color === b.color
              ? a.action.localeCompare(b.action)
              : a.color.localeCompare(b.color),
          );

        return {
          name: entry.name,
          logoUrl: `/media/${entry.name}/icon.png`,
          variants,
        } satisfies MediaAnimalWithVariants;
      }),
  );

  return animals
    .filter((animal): animal is MediaAnimalWithVariants => Boolean(animal))
    .sort((a, b) => a.name.localeCompare(b.name));
}

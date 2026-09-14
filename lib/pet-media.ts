/**
 * Shared knowledge about how pet GIFs are named on disk.
 *
 * Every GIF lives at `public/media/<animal>/<color>_<action>_<fps>fps.gif`.
 * Both `color` and `action` may contain underscores (e.g. `paint_beige_walk_fast`),
 * so the file name is split by matching a known action suffix first.
 */

/** Every action name that appears in the media library, longest first. */
export const KNOWN_PET_ACTIONS = [
  "fall_from_grab",
  "walk_fast",
  "with_ball",
  "wallclimb",
  "wallgrab",
  "idle",
  "stand",
  "swipe",
  "walk",
  "run",
  "lie",
  "jump",
  "land",
  "dead",
] as const;

export type ParsedPetGif = {
  color: string;
  action: string;
  fps: number;
};

const GIF_NAME = /^(.+)_(\d+)fps\.gif$/i;

export function parsePetGifName(fileName: string): ParsedPetGif | null {
  const match = fileName.match(GIF_NAME);
  if (!match) return null;

  const base = match[1];
  const fps = Number(match[2]);

  for (const action of KNOWN_PET_ACTIONS) {
    const suffix = `_${action}`;
    if (base.endsWith(suffix) && base.length > suffix.length) {
      return { color: base.slice(0, -suffix.length), action, fps };
    }
  }

  // Unknown action: fall back to "first token is the color".
  const separator = base.indexOf("_");
  if (separator <= 0 || separator === base.length - 1) return null;
  return {
    color: base.slice(0, separator),
    action: base.slice(separator + 1),
    fps,
  };
}

export function petGifFileName(color: string, action: string, fps = 8): string {
  return `${color}_${action}_${fps}fps.gif`;
}

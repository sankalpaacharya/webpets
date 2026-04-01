import type { GifAnimalConfig } from "./types";

export function resolveGifColor(
  config: GifAnimalConfig,
  colorOverride?: string,
): string {
  return colorOverride ?? config.defaultColor;
}

export function resolveGifAction(
  config: GifAnimalConfig,
  action: string,
): string {
  if (config.actions.includes(action)) return action;
  return config.actions[0] ?? action;
}

export function getGifUrl(
  config: GifAnimalConfig,
  action: string,
  colorOverride?: string,
): string {
  const resolvedColor = resolveGifColor(config, colorOverride);
  const resolvedAction = resolveGifAction(config, action);
  return `/media/${config.mediaFolder}/${resolvedColor}_${resolvedAction}_8fps.gif`;
}

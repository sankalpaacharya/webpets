"use client";

import { useRef } from "react";
import type { GifAnimalConfig } from "@/lib/types";
import { getGifUrl } from "@/lib/gif-utils";
import { getGifPetSpeed } from "@/lib/gif-pet-speeds";
import { useGifPetAnimation } from "@/lib/use-gif-pet-animation";

const DEFAULT_GIF_PET = {
  actions: ["idle", "run", "swipe", "walk", "walk_fast", "with_ball"],
  hoverAction: "swipe",
  hoverDist: 50,
  idleActions: [
    { name: "idle", baseDuration: 2500, extraDuration: 2000 },
    { name: "swipe", baseDuration: 1200, extraDuration: 800 },
  ],
  idleDist: 48,
  idlePauseMs: { min: 1500, max: 2200 },
  movementActions: [
    { name: "walk", speedMultiplier: 1.0 },
    { name: "walk_fast", speedMultiplier: 1.35 },
    { name: "run", speedMultiplier: 1.8 },
  ],
  speed: 4.5,
  scale: 0.5,
  spriteSize: { w: 100, h: 100 },
  followMouse: false,
} satisfies Omit<GifAnimalConfig, "name" | "mediaFolder" | "defaultColor">;

export function GifPet({
  animal,
  color = "brown",
}: {
  animal: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const config: GifAnimalConfig = {
    name: animal,
    mediaFolder: animal,
    defaultColor: color,
    actions: DEFAULT_GIF_PET.actions,
    hoverAction: DEFAULT_GIF_PET.hoverAction,
    hoverDist: DEFAULT_GIF_PET.hoverDist,
    idleActions: DEFAULT_GIF_PET.idleActions,
    idleDist: DEFAULT_GIF_PET.idleDist,
    idlePauseMs: DEFAULT_GIF_PET.idlePauseMs,
    movementActions: DEFAULT_GIF_PET.movementActions,
    speed: getGifPetSpeed(animal, DEFAULT_GIF_PET.speed),
    scale: DEFAULT_GIF_PET.scale,
    spriteSize: DEFAULT_GIF_PET.spriteSize,
    followMouse: DEFAULT_GIF_PET.followMouse,
  };

  useGifPetAnimation(ref, config, color);
  const initialGif = getGifUrl(config, config.hoverAction, color);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        bottom: "0px",
        height: `${config.spriteSize.h}px`,
        width: `${config.spriteSize.w}px`,
        zIndex: 9999,
        backgroundImage: `url("${initialGif}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom center",
        backgroundSize: "contain",
        imageRendering: "pixelated",
        pointerEvents: "none",
        transform: `scale(${config.scale ?? 1})`,
        transformOrigin: "bottom center",
      }}
    />
  );
}

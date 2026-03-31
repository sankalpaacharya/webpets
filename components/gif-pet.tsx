"use client";

import { useRef } from "react";
import type { GifAnimalConfig } from "@/lib/types";
import { useGifPetAnimation } from "@/lib/use-gif-pet-animation";

export function GifPet({ config }: { config: GifAnimalConfig }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useGifPetAnimation(ref, config);
  const scale = config.scale ?? 1;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        bottom: "0px",
        height: `${config.spriteSize.h}px`,
        width: `${config.spriteSize.w}px`,
        zIndex: 9999,
        backgroundImage: `url("${config.actions[config.hoverAction]}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom center",
        backgroundSize: "contain",
        imageRendering: "pixelated",
        pointerEvents: "none",
        transform: `scale(${scale})`,
        transformOrigin: "bottom center",
      }}
    />
  );
}

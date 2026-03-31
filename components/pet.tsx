"use client";

import { useRef } from "react";
import type { AnimalConfig } from "@/lib/types";
import { usePetAnimation } from "@/lib/use-pet-animation";

export function Pet({ config }: { config: AnimalConfig }) {
  const ref = useRef<HTMLDivElement | null>(null);
  usePetAnimation(ref, config);
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
        backgroundImage: `url("${config.spriteUrl}")`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        pointerEvents: "none",
        transform: `scale(${scale})`,
        transformOrigin: "bottom center",
      }}
    />
  );
}

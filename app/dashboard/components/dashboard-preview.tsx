"use client";

import { GifPet } from "@/components/gif-pet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";

type PreviewPanelProps = {
  animal: string;
  color: string;
  speed: number;
  scale: number;
  followMouse: boolean;
};

export function PreviewPanel({
  animal,
  color,
  speed,
  scale,
  followMouse,
}: PreviewPanelProps) {
  return (
    <Card
      className="dashboard-enter relative h-105 overflow-hidden"
      style={{
        backgroundImage: "url('/media/background/house.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        backgroundSize: "cover",
      }}
    >
      <CardHeader className="relative">
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="relative flex h-full items-end justify-center pb-6 text-xs text-muted-foreground">
        {animal ? (
          <GifPet
            animal={animal}
            color={color}
            speed={speed}
            scale={scale}
            followMouse={followMouse}
            position="absolute"
          />
        ) : null}
      </CardContent>
    </Card>
  );
}

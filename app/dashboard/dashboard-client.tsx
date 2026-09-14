"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AnimalList } from "@/app/dashboard/components/dashboard-sidebar";
import { ControlsPanel } from "@/app/dashboard/components/dashboard-control";
import { PreviewPanel } from "@/app/dashboard/components/dashboard-preview";
import { InstallSnippet } from "@/app/dashboard/components/install-snippet";
import { Button } from "@/components/ui/button";
import { getWebPetSpeed } from "@/components/web-pet";
import type { MediaAnimalWithVariants } from "@/lib/types";

type DashboardClientProps = {
  animals: MediaAnimalWithVariants[];
};

export default function DashboardClient({ animals }: DashboardClientProps) {
  const [selectedAnimalName, setSelectedAnimalName] = useState(
    animals[0]?.name ?? "",
  );
  const baseSpeed = useMemo(
    () => getWebPetSpeed(selectedAnimalName),
    [selectedAnimalName],
  );
  const [scale, setScale] = useState(0.5);
  const [speed, setSpeed] = useState(baseSpeed);
  const [followMouse, setFollowMouse] = useState(false);
  const [hoverMessage, setHoverMessage] = useState("");
  const selectedAnimal = useMemo(
    () => animals.find((animal) => animal.name === selectedAnimalName) ?? null,
    [animals, selectedAnimalName],
  );
  const availableColors = useMemo(() => {
    if (!selectedAnimal) return [];
    const colors = new Set(
      selectedAnimal.variants.map((variant) => variant.color),
    );
    return Array.from(colors).sort((a, b) => a.localeCompare(b));
  }, [selectedAnimal]);
  const [selectedColor, setSelectedColor] = useState(
    availableColors[0] ?? "brown",
  );
  const availableActions = useMemo(
    () =>
      selectedAnimal?.variants
        .filter((variant) => variant.color === selectedColor)
        .map((variant) => variant.action) ?? [],
    [selectedAnimal, selectedColor],
  );

  useEffect(() => {
    setSelectedColor(availableColors[0] ?? "brown");
  }, [availableColors]);

  useEffect(() => {
    setSpeed(baseSpeed);
  }, [baseSpeed]);

  return (
    <div className="bg-background font-body text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
            <p className="text-sm text-muted-foreground">
              Pick an animal, tune it, copy the code.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/docs">Read the Docs</Link>
          </Button>
        </header>

        <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)_300px] lg:items-start">
          <AnimalList
            animals={animals}
            selectedAnimalName={selectedAnimalName}
            onSelect={setSelectedAnimalName}
          />
          <div className="space-y-6">
            <PreviewPanel
              animal={selectedAnimalName}
              color={selectedColor}
              speed={speed}
              scale={scale}
              followMouse={followMouse}
              hoverMessage={hoverMessage}
            />
            <InstallSnippet
              animal={selectedAnimalName}
              color={selectedColor}
              actions={availableActions}
            />
          </div>
          <ControlsPanel
            speed={speed}
            scale={scale}
            baseSpeed={baseSpeed}
            selectedColor={selectedColor}
            availableColors={availableColors}
            followMouse={followMouse}
            hoverMessage={hoverMessage}
            onSpeedChange={setSpeed}
            onScaleChange={setScale}
            onColorChange={setSelectedColor}
            onFollowMouseChange={setFollowMouse}
            onHoverMessageChange={setHoverMessage}
          />
        </div>
      </div>
    </div>
  );
}

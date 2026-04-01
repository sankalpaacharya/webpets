"use client";

import { useEffect, useMemo, useState } from "react";

import { AnimalSidebar } from "@/app/dashboard/components/dashboard-sidebar";
import { ControlsPanel } from "@/app/dashboard/components/dashboard-control";
import { PreviewPanel } from "@/app/dashboard/components/dashboard-preview";
import { InstallSnippet } from "@/app/dashboard/components/install-snippet";
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
    () => getWebPetSpeed(selectedAnimalName ?? "", 4.5),
    [selectedAnimalName],
  );
  const [scale, setScale] = useState(0.5);
  const [speed, setSpeed] = useState(baseSpeed);
  const [followMouse, setFollowMouse] = useState(false);
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

  useEffect(() => {
    setSelectedColor(availableColors[0] ?? "brown");
  }, [availableColors]);

  useEffect(() => {
    setSpeed(baseSpeed);
  }, [baseSpeed]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <section className="flex-1">
          <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
            <AnimalSidebar
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
              />
              <InstallSnippet />
            </div>
            <ControlsPanel
              speed={speed}
              scale={scale}
              baseSpeed={baseSpeed}
              selectedColor={selectedColor}
              availableColors={availableColors}
              followMouse={followMouse}
              onSpeedChange={setSpeed}
              onScaleChange={setScale}
              onColorChange={setSelectedColor}
              onFollowMouseChange={setFollowMouse}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

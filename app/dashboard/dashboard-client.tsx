"use client";

import { useEffect, useMemo, useState } from "react";

import { AnimalSidebar } from "@/app/dashboard/components/dashboard-sidebar";
import { ControlsPanel } from "@/app/dashboard/components/dashboard-control";
import { PreviewPanel } from "@/app/dashboard/components/dashboard-preview";
import { InstallSnippet } from "@/app/dashboard/components/install-snippet";
import { getWebPetSpeed, WEB_PET_ACTIONS } from "@/components/web-pet";
import Link from "next/link";
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

  useEffect(() => {
    setSelectedColor(availableColors[0] ?? "brown");
  }, [availableColors]);

  useEffect(() => {
    setSpeed(baseSpeed);
  }, [baseSpeed]);

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-y-auto bg-background text-foreground">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex-1">
          <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:items-start">
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
                hoverMessage={hoverMessage}
              />
              <InstallSnippet
                animal={selectedAnimalName}
                color={selectedColor}
                actions={WEB_PET_ACTIONS}
              />
              <Link
                href={"/docs"}
                className="underline text-sm text-muted-foreground"
              >
                How to setup?
              </Link>
            </div>
            <div className="space-y-6">
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
        </section>
      </div>
    </div>
  );
}

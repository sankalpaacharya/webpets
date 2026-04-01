"use client";

import { useEffect, useMemo, useState } from "react";

import { GifPet } from "@/components/gif-pet";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Slider } from "@/components/ui/8bit/slider";
import { getGifPetSpeed } from "@/lib/gif-pet-speeds";
import type { MediaAnimalWithVariants } from "@/lib/types";

type DashboardClientProps = {
  animals: MediaAnimalWithVariants[];
};

export default function DashboardClient({ animals }: DashboardClientProps) {
  const [selectedAnimalName, setSelectedAnimalName] = useState(
    animals[0]?.name ?? "",
  );
  const baseSpeed = useMemo(
    () => getGifPetSpeed(selectedAnimalName ?? "", 4.5),
    [selectedAnimalName],
  );
  const [speed, setSpeed] = useState(baseSpeed);
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
    <div className="relative min-h-screen overflow-hidden text-[var(--foreground)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "var(--background)" }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <section className="flex-1">
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
            <aside className="dashboard-enter max-h-[calc(100vh-180px)] space-y-2 overflow-y-auto pr-2">
              {animals.map((animal, index) => {
                const isSelected = animal.name === selectedAnimalName;
                return (
                  <Button
                    key={animal.name}
                    type="button"
                    onClick={() => {
                      setSelectedAnimalName(animal.name);
                    }}
                    aria-pressed={isSelected}
                    className={`dashboard-card flex w-full items-center gap-3 border border-transparent px-3 py-2 text-left shadow-[var(--shadow-md)] transition ${
                      isSelected
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "bg-[var(--card)] text-[var(--card-foreground)] hover:bg-[var(--muted)]"
                    }`}
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[var(--popover)]">
                      <img
                        src={animal.logoUrl}
                        alt={animal.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-semibold">{animal.name}</div>
                  </Button>
                );
              })}
            </aside>

            <Card className="dashboard-enter relative h-[420px] overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
              <CardHeader className="relative">
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="relative flex h-full items-end justify-center pb-6 text-xs text-[var(--muted-foreground)]">
                {selectedAnimalName ? (
                  <GifPet
                    animal={selectedAnimalName}
                    color={selectedColor}
                    speed={speed}
                    position="absolute"
                  />
                ) : null}
              </CardContent>
            </Card>

            <aside className="dashboard-enter space-y-4 text-sm text-[var(--muted-foreground)]">
              <Card>
                <CardHeader>
                  <CardTitle>Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex flex-col gap-2">
                    <span className="font-medium text-[var(--foreground)]">
                      Speed
                    </span>
                    <Slider
                      min={1}
                      max={8}
                      step={0.1}
                      value={[speed]}
                      onValueChange={(value) => setSpeed(value[0] ?? baseSpeed)}
                    />
                    <span className="text-xs">{speed.toFixed(1)} px/tick</span>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-medium text-[var(--foreground)]">
                      Color
                    </span>
                    <select
                      value={selectedColor}
                      onChange={(event) => setSelectedColor(event.target.value)}
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--input)] px-3 py-2 text-sm text-[var(--foreground)] shadow-[var(--shadow-sm)]"
                    >
                      {availableColors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </label>
                </CardContent>
              </Card>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

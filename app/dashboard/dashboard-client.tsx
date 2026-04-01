"use client";

import Image from "next/image";
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
  const [scale, setScale] = useState(0.5);
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
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <section className="flex-1">
          <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
            <aside className="dashboard-enter flex max-h-[calc(100vh-180px)] flex-col gap-4 overflow-y-auto pr-4">
              {animals.map((animal, index) => {
                const isSelected = animal.name === selectedAnimalName;
                return (
                  <Button
                    key={animal.name}
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setSelectedAnimalName(animal.name);
                    }}
                    aria-pressed={isSelected}
                    className={`dashboard-card flex w-full items-center justify-start gap-4 px-4 py-4 text-left transition ${
                      isSelected
                        ? "ring-1 ring-blue-400/60 bg-accent text-accent-foreground"
                        : "bg-card text-card-foreground hover:bg-muted"
                    }`}
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden">
                      <Image
                        src={animal.logoUrl}
                        alt={animal.name}
                        width={32}
                        height={32}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="text-sm font-semibold">{animal.name}</div>
                  </Button>
                );
              })}
            </aside>

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
                {selectedAnimalName ? (
                  <GifPet
                    animal={selectedAnimalName}
                    color={selectedColor}
                    speed={speed}
                    scale={scale}
                    position="absolute"
                  />
                ) : null}
              </CardContent>
            </Card>

            <aside className="dashboard-enter space-y-4 text-sm text-muted-foreground">
              <Card>
                <CardHeader>
                  <CardTitle>Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <label className="flex flex-col gap-2">
                    <span className="font-medium text-foreground">Speed</span>
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
                    <span className="font-medium text-foreground">Scale</span>
                    <Slider
                      min={0.3}
                      max={1.5}
                      step={0.05}
                      value={[scale]}
                      onValueChange={(value) => setScale(value[0] ?? 0.5)}
                    />
                    <span className="text-xs">{scale.toFixed(2)}x</span>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="font-medium text-foreground">Color</span>
                    <select
                      value={selectedColor}
                      onChange={(event) => setSelectedColor(event.target.value)}
                      className="w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-foreground shadow-sm"
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

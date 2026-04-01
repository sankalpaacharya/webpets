"use client";

import { useEffect, useMemo, useState } from "react";

import { GifPet } from "@/components/gif-pet";
import type { MediaAnimalWithVariants } from "@/lib/types";

type DashboardClientProps = {
  animals: MediaAnimalWithVariants[];
};

export default function DashboardClient({ animals }: DashboardClientProps) {
  const [selectedAnimalName, setSelectedAnimalName] = useState(
    animals[0]?.name ?? "",
  );
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

  return (
    <div className="relative min-h-screen overflow-hidden text-[var(--foreground)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundColor: "var(--background)" }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <section className="flex-1">
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            <div className="flex flex-wrap gap-3">
              {animals.map((animal, index) => {
                const isSelected = animal.name === selectedAnimalName;
                return (
                  <button
                    key={animal.name}
                    type="button"
                    onClick={() => {
                      setSelectedAnimalName(animal.name);
                    }}
                    aria-pressed={isSelected}
                    className={`dashboard-card flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2 text-left shadow-[var(--shadow-md)] transition sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] ${
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
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-4 text-sm text-[var(--muted-foreground)]">
            <label className="flex flex-col gap-2">
              <span className="font-medium">Color</span>
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
          </div>
        </section>
      </div>

      {selectedAnimalName ? (
        <GifPet animal={selectedAnimalName} color={selectedColor} />
      ) : null}
    </div>
  );
}

"use client";

import Image from "next/image";

import { Button } from "@/components/ui/8bit/button";
import type { GeneratedAnimalWithVariants } from "@/lib/types";

type GeneratedSidebarProps = {
  animals: GeneratedAnimalWithVariants[];
  selectedAnimalName: string;
  onSelect: (name: string) => void;
};

export function GeneratedSidebar({
  animals,
  selectedAnimalName,
  onSelect,
}: GeneratedSidebarProps) {
  return (
    <aside className="dashboard-enter flex max-h-[calc(100vh-180px)] flex-col gap-4 overflow-y-auto pr-4">
      {animals.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground">
          No generated GIFs found.
        </div>
      ) : null}
      {animals.map((animal, index) => {
        const isSelected = animal.name === selectedAnimalName;
        return (
          <Button
            key={animal.name}
            type="button"
            variant="ghost"
            onClick={() => onSelect(animal.name)}
            aria-pressed={isSelected}
            className={`dashboard-card flex w-full items-center justify-start gap-4 px-4 py-4 text-left transition ${
              isSelected
                ? "ring-1 ring-blue-400/60 bg-accent text-accent-foreground"
                : "bg-card text-card-foreground hover:bg-muted"
            }`}
            style={{ animationDelay: `${index * 35}ms` }}
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted text-xs uppercase text-muted-foreground">
              {animal.logoUrl ? (
                <Image
                  src={animal.logoUrl}
                  alt={animal.name}
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span>{animal.name.slice(0, 2)}</span>
              )}
            </div>
            <div className="text-sm font-semibold">{animal.name}</div>
          </Button>
        );
      })}
    </aside>
  );
}

"use client";

import Image from "next/image";

import { Button } from "@/components/ui/8bit/button";
import type { MediaAnimalWithVariants } from "@/lib/types";

type AnimalSidebarProps = {
  animals: MediaAnimalWithVariants[];
  selectedAnimalName: string;
  onSelect: (name: string) => void;
};

export function AnimalSidebar({
  animals,
  selectedAnimalName,
  onSelect,
}: AnimalSidebarProps) {
  return (
    <aside className="dashboard-enter flex max-h-[calc(100vh-180px)] flex-col gap-4 overflow-y-auto pr-4">
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
  );
}

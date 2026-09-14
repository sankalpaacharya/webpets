"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { MediaAnimalWithVariants } from "@/lib/types";

type AnimalListProps = {
  animals: MediaAnimalWithVariants[];
  selectedAnimalName: string;
  onSelect: (name: string) => void;
};

export function AnimalList({
  animals,
  selectedAnimalName,
  onSelect,
}: AnimalListProps) {
  return (
    <nav
      aria-label="Animals"
      className="flex max-h-[calc(100svh-12rem)] flex-col gap-0.5 overflow-y-auto pr-2 lg:sticky lg:top-24"
    >
      {animals.map((animal) => {
        const isSelected = animal.name === selectedAnimalName;
        return (
          <Button
            key={animal.name}
            type="button"
            variant={isSelected ? "secondary" : "ghost"}
            onClick={() => onSelect(animal.name)}
            aria-pressed={isSelected}
            className="h-9 justify-start gap-2.5 px-2 font-normal"
          >
            <Image
              src={animal.logoUrl}
              alt=""
              width={20}
              height={20}
              unoptimized
              className="size-5 [image-rendering:pixelated]"
            />
            <span className="truncate">{animal.name}</span>
          </Button>
        );
      })}
    </nav>
  );
}

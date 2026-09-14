"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { Cancel01Icon, Github01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { WebPet } from "@/components/web-pet";
import type { WebPetProps } from "@/components/web-pet";
import { PET_MANIFEST } from "@/lib/pet-manifest";
import { cn } from "@/lib/utils";

export type PetPickerProps = Omit<
  WebPetProps,
  "animal" | "color" | "onClick" | "paused" | "ref"
> & {
  /** Animals to offer. Defaults to every animal in the manifest. */
  animals?: string[];
  /** Color per animal. Falls back to each animal's first color. */
  colors?: Record<string, string>;
  /** Animal shown before the visitor picks one. `null` shows only the trigger. */
  defaultAnimal?: string | null;
  /** localStorage key the choice is saved under. Pass `null` to not persist. */
  storageKey?: string | null;
  /** Called whenever the visitor picks an animal, or `null` for none. */
  onChange?: (animal: string | null) => void;
  /** Extra classes for the menu, which is portaled to the body. */
  popoverClassName?: string;
};

const DEFAULT_STORAGE_KEY = "webpet:animal";
const NONE = "__none__";

function readStored(key: string | null): string | null | undefined {
  if (!key) return undefined;
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return undefined;
    return value === NONE ? null : value;
  } catch {
    return undefined;
  }
}

function writeStored(key: string | null, animal: string | null) {
  if (!key) return;
  try {
    window.localStorage.setItem(key, animal ?? NONE);
  } catch {
    // Storage can be unavailable; the choice still applies for this visit.
  }
}

export function PetPicker({
  animals = Object.keys(PET_MANIFEST),
  colors,
  defaultAnimal = animals[0] ?? null,
  storageKey = DEFAULT_STORAGE_KEY,
  onChange,
  popoverClassName,
  mediaBaseUrl = "/media",
  position = "fixed",
  zIndex = 9999,
  style,
  ...petProps
}: PetPickerProps) {
  const [animal, setAnimal] = useState<string | null>(defaultAnimal);
  const [open, setOpen] = useState(false);

  // Restore a saved choice after mount so server and client markup match.
  useEffect(() => {
    const stored = readStored(storageKey);
    if (stored !== undefined) {
      setAnimal(stored);
    }
  }, [storageKey]);

  const choose = (next: string | null) => {
    setAnimal(next);
    writeStored(storageKey, next);
    onChange?.(next);
    setOpen(false);
  };

  const colorFor = (name: string) =>
    colors?.[name] ?? PET_MANIFEST[name]?.colors[0] ?? "brown";

  const triggerStyle: CSSProperties = {
    position,
    bottom: 8,
    left: 8,
    zIndex,
    ...style,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {animal ? (
        <PopoverAnchor asChild>
          <WebPet
            {...petProps}
            animal={animal}
            color={colorFor(animal)}
            mediaBaseUrl={mediaBaseUrl}
            position={position}
            zIndex={zIndex}
            style={style}
            paused={open}
            onClick={() => setOpen((value) => !value)}
          />
        </PopoverAnchor>
      ) : (
        <PopoverAnchor asChild>
          <button
            type="button"
            aria-label="Choose a pet"
            onClick={() => setOpen((value) => !value)}
            style={triggerStyle}
            className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={16} />
          </button>
        </PopoverAnchor>
      )}

      <PopoverContent
        side="top"
        align="start"
        sideOffset={8}
        className={cn("w-[360px] p-3", popoverClassName)}
      >
        <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Choose pet
        </p>
        <div role="listbox" aria-label="Pets" className="grid grid-cols-5 gap-1">
          <PickerCell
            selected={animal === null}
            label="None"
            onSelect={() => choose(null)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} className="text-muted-foreground" />
          </PickerCell>
          {animals.map((name) => (
            <PickerCell
              key={name}
              selected={animal === name}
              label={name}
              onSelect={() => choose(name)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- tiny pixel icon, no optimization wanted */}
              <img
                src={`${mediaBaseUrl}/${name}/icon.png`}
                alt=""
                width={32}
                height={32}
                className="size-8 [image-rendering:pixelated]"
              />
            </PickerCell>
          ))}
        </div>
        <a
          href="https://pets.sanku.lol"
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <HugeiconsIcon icon={Github01Icon} size={12} />
          webpets by sankalpa
        </a>
      </PopoverContent>
    </Popover>
  );
}

type PickerCellProps = {
  selected: boolean;
  label: string;
  onSelect: () => void;
  children: React.ReactNode;
};

function PickerCell({ selected, label, onSelect, children }: PickerCellProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] transition-colors",
        selected
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <span className="flex size-8 items-center justify-center">{children}</span>
      <span className="w-full truncate text-center">{label}</span>
    </button>
  );
}

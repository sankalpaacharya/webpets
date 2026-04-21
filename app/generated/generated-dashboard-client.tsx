"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { GeneratedSidebar } from "@/app/generated/components/generated-sidebar";
import { GeneratedControls } from "@/app/generated/components/generated-controls";
import { GeneratedPreview } from "@/app/generated/components/generated-preview";
import type { GeneratedAnimalWithVariants } from "@/lib/types";

type GeneratedDashboardClientProps = {
  animals: GeneratedAnimalWithVariants[];
};

export default function GeneratedDashboardClient({
  animals,
}: GeneratedDashboardClientProps) {
  const [selectedAnimalName, setSelectedAnimalName] = useState(
    animals[0]?.name ?? "",
  );
  const selectedAnimal = useMemo(
    () => animals.find((animal) => animal.name === selectedAnimalName) ?? null,
    [animals, selectedAnimalName],
  );
  const availableVariants = useMemo(() => {
    if (!selectedAnimal) return [];
    const variants = new Set(
      selectedAnimal.variants.map((variant) => variant.variant),
    );
    return Array.from(variants).sort((a, b) => a.localeCompare(b));
  }, [selectedAnimal]);
  const [selectedVariant, setSelectedVariant] = useState(
    availableVariants[0] ?? "",
  );
  const availableActions = useMemo(() => {
    if (!selectedAnimal) return [];
    const actions = new Set(
      selectedAnimal.variants
        .filter((variant) => variant.variant === selectedVariant)
        .map((variant) => variant.action),
    );
    return Array.from(actions).sort((a, b) => a.localeCompare(b));
  }, [selectedAnimal, selectedVariant]);
  const [selectedAction, setSelectedAction] = useState(
    availableActions[0] ?? "",
  );
  const selectedGif = useMemo(() => {
    if (!selectedAnimal) return null;
    return (
      selectedAnimal.variants.find(
        (variant) =>
          variant.variant === selectedVariant &&
          variant.action === selectedAction,
      ) ?? null
    );
  }, [selectedAnimal, selectedVariant, selectedAction]);

  useEffect(() => {
    setSelectedVariant(availableVariants[0] ?? "");
  }, [availableVariants]);

  useEffect(() => {
    setSelectedAction(availableActions[0] ?? "");
  }, [availableActions]);

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-y-auto bg-background text-foreground">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="flex-1">
          <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:items-start">
            <GeneratedSidebar
              animals={animals}
              selectedAnimalName={selectedAnimalName}
              onSelect={setSelectedAnimalName}
            />
            <div className="space-y-6">
              <GeneratedPreview
                animal={selectedAnimalName}
                variant={selectedVariant}
                action={selectedAction}
                selectedGif={selectedGif}
              />
              <Link
                href="/playground"
                className="underline text-sm text-muted-foreground"
              >
                Back to playground
              </Link>
            </div>
            <div className="space-y-6">
              <GeneratedControls
                variants={availableVariants}
                actions={availableActions}
                selectedVariant={selectedVariant}
                selectedAction={selectedAction}
                onVariantChange={setSelectedVariant}
                onActionChange={setSelectedAction}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

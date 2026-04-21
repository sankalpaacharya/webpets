"use client";

import { useEffect, useMemo, useState } from "react";

import { GeneratedSidebar } from "@/app/generated/components/generated-sidebar";
import { ReadmeControls } from "@/app/readme/components/readme-controls";
import { ReadmePreview } from "@/app/readme/components/readme-preview";
import type { GeneratedAnimalWithVariants } from "@/lib/types";

type ReadmeDashboardClientProps = {
  animals: GeneratedAnimalWithVariants[];
};

type ApiConfig = {
  animal: string;
  variant: string;
  action: string;
};

export default function ReadmeDashboardClient({
  animals,
}: ReadmeDashboardClientProps) {
  const [selectedAnimalName, setSelectedAnimalName] = useState(
    animals[0]?.name ?? "",
  );
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [savedConfig, setSavedConfig] = useState<ApiConfig | null>(null);
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [liveRefreshKey, setLiveRefreshKey] = useState(0);

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
  const availableActions = useMemo(() => {
    if (!selectedAnimal) return [];
    const actions = new Set(
      selectedAnimal.variants
        .filter((variant) => variant.variant === selectedVariant)
        .map((variant) => variant.action),
    );
    return Array.from(actions).sort((a, b) => a.localeCompare(b));
  }, [selectedAnimal, selectedVariant]);
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
    let active = true;

    const loadConfig = async () => {
      if (animals.length === 0) return;
      try {
        const response = await fetch("/api?config=1");
        if (!response.ok) return;
        const data = (await response.json()) as { config?: ApiConfig };
        if (!active || !data?.config) return;

        const configAnimal = animals.find(
          (animal) => animal.name === data.config?.animal,
        )
          ? data.config.animal
          : animals[0]?.name ?? "";
        const nextAnimal = animals.find(
          (animal) => animal.name === configAnimal,
        );
        const variantOptions = Array.from(
          new Set(nextAnimal?.variants.map((variant) => variant.variant) ?? []),
        );
        const configVariant = variantOptions.includes(data.config.variant)
          ? data.config.variant
          : variantOptions[0] ?? "";
        const actionOptions = Array.from(
          new Set(
            nextAnimal?.variants
              .filter((variant) => variant.variant === configVariant)
              .map((variant) => variant.action) ?? [],
          ),
        );
        const configAction = actionOptions.includes(data.config.action)
          ? data.config.action
          : actionOptions[0] ?? "";

        setSelectedAnimalName(configAnimal);
        setSelectedVariant(configVariant);
        setSelectedAction(configAction);
        setSavedConfig({
          animal: configAnimal,
          variant: configVariant,
          action: configAction,
        });
      } catch {
        // Ignore, defaults will stay in place.
      }
    };

    loadConfig();

    return () => {
      active = false;
    };
  }, [animals]);

  useEffect(() => {
    if (availableVariants.length === 0) {
      setSelectedVariant("");
      return;
    }
    setSelectedVariant((prev) =>
      availableVariants.includes(prev) ? prev : availableVariants[0] ?? "",
    );
  }, [availableVariants]);

  useEffect(() => {
    if (availableActions.length === 0) {
      setSelectedAction("");
      return;
    }
    setSelectedAction((prev) =>
      availableActions.includes(prev) ? prev : availableActions[0] ?? "",
    );
  }, [availableActions]);

  const handleSave = async () => {
    if (!selectedAnimalName || !selectedVariant || !selectedAction) return;
    setSaveState("saving");
    setSaveMessage("");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animal: selectedAnimalName,
          variant: selectedVariant,
          action: selectedAction,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        config?: ApiConfig;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error ?? "Save failed");
      }

      const resolvedConfig = data?.config ?? {
        animal: selectedAnimalName,
        variant: selectedVariant,
        action: selectedAction,
      };

      setSavedConfig(resolvedConfig);
      setSaveState("saved");
      setSaveMessage("Saved. /api now serves this GIF.");
      setLiveRefreshKey((prev) => prev + 1);
      window.setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      setSaveState("error");
      setSaveMessage(message);
    }
  };

  const savedLabel = savedConfig
    ? `${savedConfig.animal} / ${savedConfig.variant} / ${savedConfig.action}`
    : "Not saved yet";

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
              <ReadmePreview
                animal={selectedAnimalName}
                variant={selectedVariant}
                action={selectedAction}
                selectedGif={selectedGif}
                savedLabel={savedLabel}
                liveUrl="/api"
                liveRefreshKey={liveRefreshKey}
              />
            </div>
            <div className="space-y-6">
              <ReadmeControls
                variants={availableVariants}
                actions={availableActions}
                selectedVariant={selectedVariant}
                selectedAction={selectedAction}
                onVariantChange={setSelectedVariant}
                onActionChange={setSelectedAction}
                onSave={handleSave}
                saveState={saveState}
                saveMessage={saveMessage}
                disabled={!selectedGif}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

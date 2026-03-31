"use client";

import { useEffect, useMemo, useState } from "react";

import { GifPet } from "@/components/gif-pet";
import bear from "@/lib/animals/bear";
import cat from "@/lib/animals/cat";
import chickenBrown from "@/lib/animals/chicken-brown";
import clippyBlack from "@/lib/animals/clippy-black";
import cockatielBrown from "@/lib/animals/cockatiel-brown";
import crabRed from "@/lib/animals/crab-red";
import deno from "@/lib/animals/deno";
import dogAkita from "@/lib/animals/dog-akita";
import foxRed from "@/lib/animals/fox-red";
import horseBlack from "@/lib/animals/horse-black";
import modPurple from "@/lib/animals/mod-purple";
import monkeyGray from "@/lib/animals/monkey-gray";
import morphPurple from "@/lib/animals/morph-purple";
import pandaBlack from "@/lib/animals/panda-black";
import ratBrown from "@/lib/animals/rat-brown";
import rockyGray from "@/lib/animals/rocky-gray";
import rubberDuckYellow from "@/lib/animals/rubber-duck-yellow";
import skeletonBlue from "@/lib/animals/skeleton-blue";
import snailBrown from "@/lib/animals/snail-brown";
import snakeGreen from "@/lib/animals/snake-green";
import totoroGray from "@/lib/animals/totoro-gray";
import turtleGreen from "@/lib/animals/turtle-green";
import zappyYellow from "@/lib/animals/zappy-yellow";
import type { GifAnimalConfig, MediaAnimalWithVariants } from "@/lib/types";

type DashboardClientProps = {
  animals: MediaAnimalWithVariants[];
};

function getUniqueSorted(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

const petPreviewConfigs: Record<string, GifAnimalConfig> = {
  bear,
  cat,
  chicken: chickenBrown,
  clippy: clippyBlack,
  cockatiel: cockatielBrown,
  crab: crabRed,
  deno,
  dog: dogAkita,
  fox: foxRed,
  horse: horseBlack,
  mod: modPurple,
  monkey: monkeyGray,
  morph: morphPurple,
  panda: pandaBlack,
  rat: ratBrown,
  rocky: rockyGray,
  "rubber-duck": rubberDuckYellow,
  skeleton: skeletonBlue,
  snail: snailBrown,
  snake: snakeGreen,
  totoro: totoroGray,
  turtle: turtleGreen,
  zappy: zappyYellow,
};

export default function DashboardClient({ animals }: DashboardClientProps) {
  const initialVariant = animals[0]?.variants[0];
  const [selectedAnimalName, setSelectedAnimalName] = useState(
    animals[0]?.name ?? "",
  );
  const [selectedColor, setSelectedColor] = useState(
    initialVariant?.color ?? "",
  );
  const [selectedAction, setSelectedAction] = useState(
    initialVariant?.action ?? "",
  );
  const [isPetPreviewOpen, setIsPetPreviewOpen] = useState(false);

  const selectedAnimal =
    animals.find((animal) => animal.name === selectedAnimalName) ?? null;
  const variants = selectedAnimal?.variants ?? [];

  const colors = useMemo(
    () => getUniqueSorted(variants.map((variant) => variant.color)),
    [variants],
  );

  const actions = useMemo(() => {
    const actionSource = selectedColor
      ? variants.filter((variant) => variant.color === selectedColor)
      : variants;
    return getUniqueSorted(actionSource.map((variant) => variant.action));
  }, [selectedColor, variants]);

  const previewVariant =
    variants.find(
      (variant) =>
        variant.color === selectedColor && variant.action === selectedAction,
    ) ??
    variants.find((variant) => variant.color === selectedColor) ??
    variants[0];

  const hasVariants = variants.length > 0;
  const petPreviewConfig =
    (selectedAnimalName
      ? petPreviewConfigs[selectedAnimalName]
      : undefined) ?? null;
  const petPreviewScale = 0.6;
  const petPreviewDisplayConfig = petPreviewConfig
    ? {
        ...petPreviewConfig,
        scale: (petPreviewConfig.scale ?? 1) * petPreviewScale,
      }
    : null;
  const canPreviewPet = Boolean(petPreviewConfig);

  useEffect(() => {
    if (!canPreviewPet) {
      setIsPetPreviewOpen(false);
    }
  }, [canPreviewPet]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 15%, rgba(255, 245, 214, 0.9), transparent 55%), radial-gradient(circle at 85% 10%, rgba(204, 255, 230, 0.65), transparent 45%), radial-gradient(circle at 80% 85%, rgba(196, 224, 255, 0.7), transparent 50%), linear-gradient(135deg, #fef6df 0%, #f5fbf6 45%, #eef6ff 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <header className="dashboard-enter flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm uppercase tracking-[0.25em] text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
            Media pets
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">
                Animal dashboard
              </h1>
              <p className="mt-2 max-w-xl text-base text-slate-700">
                A quick scan of the media library. Every folder with a logo is
                listed here.
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-slate-700 shadow-[0_10px_26px_rgba(15,23,42,0.1)]">
              {animals.length} animals detected
            </div>
          </div>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="dashboard-enter rounded-3xl border border-white/70 bg-white/75 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="flex items-center justify-between px-2 pb-3 text-sm font-medium text-slate-600">
              <span>Animal list</span>
              <span className="rounded-full bg-slate-900 px-2 py-1 text-xs text-white">
                static
              </span>
            </div>
            <div className="max-h-[calc(100vh-260px)] space-y-3 overflow-y-auto pr-2">
              {animals.map((animal, index) => {
                const isSelected = animal.name === selectedAnimalName;
                return (
                  <button
                    key={animal.name}
                    type="button"
                    onClick={() => {
                      setSelectedAnimalName(animal.name);
                      const firstVariant = animal.variants[0];
                      setSelectedColor(firstVariant?.color ?? "");
                      setSelectedAction(firstVariant?.action ?? "");
                    }}
                    aria-pressed={isSelected}
                    className={`dashboard-card flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition ${
                      isSelected
                        ? "border-slate-900/50 bg-white"
                        : "border-white/70 bg-white/90"
                    }`}
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <img
                        src={animal.logoUrl}
                        alt={animal.name}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {animal.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <main className="dashboard-enter flex h-full flex-col justify-start gap-6 rounded-3xl border border-white/70 bg-white/70 p-8 shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur">
            {selectedAnimal ? (
              <>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    Selected animal
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                    {selectedAnimal.name}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {variants.length} GIFs found
                  </p>
                </div>

                {hasVariants ? (
                  <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                          Colors
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {colors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                setSelectedColor(color);
                                const nextActions = variants
                                  .filter((variant) => variant.color === color)
                                  .map((variant) => variant.action);
                                setSelectedAction(nextActions[0] ?? "");
                              }}
                              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                                color === selectedColor
                                  ? "border-slate-900/60 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-700"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                          Actions
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {actions.map((action) => (
                            <button
                              key={action}
                              type="button"
                              onClick={() => setSelectedAction(action)}
                              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                                action === selectedAction
                                  ? "border-slate-900/60 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-700"
                              }`}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                          Preview
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsPetPreviewOpen((prev) => !prev)}
                          disabled={!canPreviewPet}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                            canPreviewPet
                              ? "border-slate-900/60 bg-slate-900 text-white"
                              : "border-slate-200 bg-slate-100 text-slate-400"
                          }`}
                        >
                          {isPetPreviewOpen ? "Hide pet" : "Preview pet"}
                        </button>
                      </div>
                      <div className="mt-4 flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
                        {previewVariant ? (
                          <img
                            src={previewVariant.gifUrl}
                            alt={`${selectedAnimal.name} ${previewVariant.color} ${previewVariant.action}`}
                            className="h-56 w-56 object-contain"
                          />
                        ) : (
                          <p className="text-sm text-slate-500">
                            No preview available.
                          </p>
                        )}
                      </div>
                      {previewVariant ? (
                        <p className="mt-3 text-xs text-slate-500">
                          {previewVariant.color} / {previewVariant.action} /{" "}
                          {previewVariant.fps}
                          fps
                        </p>
                      ) : null}
                      {!canPreviewPet ? (
                        <p className="mt-2 text-xs text-slate-400">
                          Sprite preview not available for this animal.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
                    No GIF animations were found for this animal. Add files like
                    color_action_8fps.gif to the folder.
                  </div>
                )}
              </>
            ) : (
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Coming next
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                  Select an animal to preview
                </h2>
                <p className="mt-3 max-w-lg text-base text-slate-700">
                  We can add a detail panel, interactions, and action previews
                  after the sidebar layout is approved.
                </p>
              </div>
            )}
          </main>
        </section>
      </div>

      {isPetPreviewOpen && petPreviewDisplayConfig ? (
        <GifPet config={petPreviewDisplayConfig} />
      ) : null}
    </div>
  );
}

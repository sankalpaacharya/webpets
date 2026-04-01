const GIF_PET_SPEEDS: Record<string, number> = {
  bear: 3.9,
  cat: 4.6,
  chicken: 4.3,
  clippy: 3.2,
  cockatiel: 4.0,
  crab: 3.4,
  deno: 4.8,
  dog: 5.5,
  fox: 5.2,
  horse: 5.8,
  mod: 4.0,
  monkey: 4.7,
  morph: 4.0,
  panda: 3.6,
  rat: 4.9,
  rocky: 2.8,
  "rubber-duck": 3.0,
  skeleton: 4.4,
  snail: 1.4,
  snake: 3.7,
  totoro: 3.1,
  turtle: 2.2,
  zappy: 5.0,
};

export function getGifPetSpeed(animal: string, fallback: number): number {
  return GIF_PET_SPEEDS[animal] ?? fallback;
}

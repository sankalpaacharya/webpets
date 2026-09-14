import { describe, expect, test } from "bun:test";

import {
  createPetState,
  DEFAULT_PET_BEHAVIOR,
  EDGE_MARGIN_PX,
  stepPet,
} from "./web-pet-engine";
import type { PetBehavior, PetInput, PetState } from "./web-pet-engine";

const sprite = { width: 50, height: 50 };

function input(overrides: Partial<PetInput> = {}): PetInput {
  return { ts: 0, boundsWidth: 1000, mouse: null, sprite, ...overrides };
}

/** Deterministic "random" that always returns the same value. */
const fixed = (value: number) => () => value;

function run(
  state: PetState,
  behavior: PetBehavior,
  ticks: number,
  make: (i: number) => PetInput,
  random = fixed(0.5),
): PetState {
  for (let i = 0; i < ticks; i += 1) state = stepPet(state, make(i), behavior, random);
  return state;
}

describe("wandering", () => {
  test("picks a target, walks to it, then pauses and idles", () => {
    const behavior = DEFAULT_PET_BEHAVIOR;
    let state = createPetState(behavior);

    state = stepPet(state, input({ ts: 0 }), behavior, fixed(0.5));
    expect(state.mode).toBe("walking");
    expect(state.targetX).not.toBeNull();
    expect(state.x).toBeGreaterThan(EDGE_MARGIN_PX);

    const target = state.targetX!;
    state = run(state, behavior, 200, (i) => input({ ts: (i + 1) * 125 }));
    expect(state.mode).toBe("idle");
    expect(Math.abs(state.x - target)).toBeLessThan(behavior.idleDist);
    expect(state.targetX).toBeNull();
    expect(state.pauseUntil).toBeGreaterThan(0);
  });

  test("never leaves the bounds", () => {
    const behavior = { ...DEFAULT_PET_BEHAVIOR, speed: 200 };
    let state = createPetState(behavior);
    for (let i = 0; i < 500; i += 1) {
      state = stepPet(state, input({ ts: i * 125, boundsWidth: 300 }), behavior, Math.random);
      expect(state.x).toBeGreaterThanOrEqual(EDGE_MARGIN_PX);
      expect(state.x).toBeLessThanOrEqual(300 - EDGE_MARGIN_PX);
    }
  });

  test("faces the direction of travel", () => {
    const behavior = DEFAULT_PET_BEHAVIOR;
    const state = stepPet(
      createPetState(behavior, 900),
      input({ boundsWidth: 1000 }),
      behavior,
      fixed(0.5),
    );
    expect(state.facing).toBe(-1);
  });
});

describe("hover", () => {
  test("shows the hover action while the cursor is near the sprite", () => {
    const behavior = DEFAULT_PET_BEHAVIOR;
    let state = createPetState(behavior, 500);
    const near = { x: 500, y: -sprite.height / 2 };
    state = stepPet(state, input({ mouse: near }), behavior);
    expect(state.mode).toBe("hover");
    expect(state.action).toBe("swipe");

    const far = { x: 500, y: -500 };
    state = stepPet(state, input({ ts: 125, mouse: far }), behavior);
    expect(state.mode).not.toBe("hover");
  });

  test("hover does not move the pet", () => {
    const behavior = DEFAULT_PET_BEHAVIOR;
    const start = createPetState(behavior, 500);
    const end = run(start, behavior, 20, (i) =>
      input({ ts: i * 125, mouse: { x: 500, y: -25 } }),
    );
    expect(end.x).toBe(500);
  });
});

describe("followMouse", () => {
  test("walks toward the cursor and idles once close", () => {
    const behavior = { ...DEFAULT_PET_BEHAVIOR, followMouse: true, speed: 10 };
    const state = run(createPetState(behavior, 100), behavior, 100, (i) =>
      input({ ts: i * 125, mouse: { x: 700, y: -400 } }),
    );
    expect(state.mode).toBe("idle");
    expect(Math.abs(state.x - 700)).toBeLessThan(behavior.idleDist);
  });

  test("stays put when the cursor position is unknown", () => {
    const behavior = { ...DEFAULT_PET_BEHAVIOR, followMouse: true };
    const state = run(createPetState(behavior, 100), behavior, 10, (i) =>
      input({ ts: i * 125 }),
    );
    expect(state.x).toBe(100);
    expect(state.mode).toBe("idle");
  });
});

describe("action fallback", () => {
  test("falls back to the first available action for GIFs the animal lacks", () => {
    // e.g. monkey ships no walk_fast GIF
    const behavior: PetBehavior = {
      ...DEFAULT_PET_BEHAVIOR,
      actions: ["idle", "run", "swipe", "walk", "with_ball"],
      movementActions: [{ name: "walk_fast", speedMultiplier: 1.35 }],
    };
    const state = stepPet(createPetState(behavior), input(), behavior, fixed(0.5));
    expect(state.mode).toBe("walking");
    expect(state.action).toBe("idle");
  });
});

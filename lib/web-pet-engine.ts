/**
 * Pure simulation for a web pet. No React, no DOM.
 *
 * `stepPet` takes the previous state plus what the world looks like right now
 * and returns the next state. The component is responsible for feeding it
 * inputs and painting the result.
 */

export type PetIdleAction = {
  name: string;
  /** Base duration in ms. */
  baseDuration: number;
  /** Random extra duration in ms added on top of baseDuration. */
  extraDuration: number;
};

export type PetMovementAction = {
  name: string;
  /** Multiplier applied to the base speed. */
  speedMultiplier: number;
};

export type PetBehavior = {
  /** Base movement speed in px per tick. */
  speed: number;
  /** If true the pet chases the cursor; otherwise it wanders. */
  followMouse: boolean;
  /** Distance (px) from the target at which the pet stops and idles. */
  idleDist: number;
  /** Action shown while the cursor is within `hoverDist` of the sprite. */
  hoverAction: string;
  /** Distance (px) from the sprite center at which hover triggers. */
  hoverDist: number;
  /** Random pause (ms) between wander segments. */
  idlePauseMs: { min: number; max: number };
  /** Actions this pet has GIFs for. Unknown actions fall back to the first. */
  actions: string[];
  idleActions: PetIdleAction[];
  movementActions: PetMovementAction[];
};

export type PetMode = "hover" | "idle" | "walking";

export type PetState = {
  /** Horizontal center of the sprite, in px from the left of its bounds. */
  x: number;
  facing: 1 | -1;
  mode: PetMode;
  /** Action whose GIF should be displayed. */
  action: string;
  idleAction: string;
  idleActionUntil: number;
  idleCooldownUntil: number;
  movementAction: string;
  movementSpeedMultiplier: number;
  /** Wander destination, or null when a new one should be picked. */
  targetX: number | null;
  pauseUntil: number;
};

export type PetInput = {
  /** Timestamp in ms (e.g. from requestAnimationFrame). */
  ts: number;
  /** Width of the area the pet may roam, in px. */
  boundsWidth: number;
  /**
   * Cursor position relative to the bottom-left corner of the pet's bounds,
   * with y growing downward (so a cursor above the floor has negative y).
   * Null when the cursor position is unknown.
   */
  mouse: { x: number; y: number } | null;
  /** Rendered sprite size in px. */
  sprite: { width: number; height: number };
};

export const EDGE_MARGIN_PX = 16;
const WANDER_MIN_RATIO = 0.2;
const WANDER_MAX_RATIO = 0.55;

export const DEFAULT_PET_BEHAVIOR: PetBehavior = {
  speed: 4.5,
  followMouse: false,
  idleDist: 48,
  hoverAction: "swipe",
  hoverDist: 50,
  idlePauseMs: { min: 1500, max: 2200 },
  actions: ["idle", "run", "swipe", "walk", "walk_fast", "with_ball"],
  idleActions: [
    { name: "idle", baseDuration: 2500, extraDuration: 2000 },
    { name: "swipe", baseDuration: 1200, extraDuration: 800 },
  ],
  movementActions: [
    { name: "walk", speedMultiplier: 1.0 },
    { name: "walk_fast", speedMultiplier: 1.35 },
    { name: "run", speedMultiplier: 1.8 },
  ],
};

export function resolveAction(behavior: PetBehavior, action: string): string {
  if (behavior.actions.includes(action)) return action;
  return behavior.actions[0] ?? action;
}

export function defaultIdleAction(behavior: PetBehavior): string {
  return resolveAction(behavior, behavior.idleActions[0]?.name ?? "idle");
}

export function createPetState(
  behavior: PetBehavior,
  initialX = EDGE_MARGIN_PX,
): PetState {
  const idle = defaultIdleAction(behavior);
  return {
    x: initialX,
    facing: 1,
    mode: "idle",
    action: idle,
    idleAction: idle,
    idleActionUntil: 0,
    idleCooldownUntil: 0,
    movementAction: behavior.movementActions[0]?.name ?? "walk",
    movementSpeedMultiplier: behavior.movementActions[0]?.speedMultiplier ?? 1,
    targetX: null,
    pauseUntil: 0,
  };
}

function clampX(x: number, boundsWidth: number): number {
  const max = Math.max(EDGE_MARGIN_PX, boundsWidth - EDGE_MARGIN_PX);
  return Math.min(max, Math.max(EDGE_MARGIN_PX, x));
}

function pickWanderTarget(
  x: number,
  boundsWidth: number,
  random: () => number,
): number {
  const maxX = Math.max(EDGE_MARGIN_PX, boundsWidth - EDGE_MARGIN_PX);
  const roomLeft = Math.max(0, x - EDGE_MARGIN_PX);
  const roomRight = Math.max(0, maxX - x);
  const minDist = boundsWidth * WANDER_MIN_RATIO;
  const maxDist = boundsWidth * WANDER_MAX_RATIO;
  const dist = minDist + random() * Math.max(0, maxDist - minDist);

  const canLeft = roomLeft >= dist;
  const canRight = roomRight >= dist;
  let dir: 1 | -1;
  if (canLeft && canRight) dir = random() < 0.5 ? -1 : 1;
  else if (canLeft) dir = -1;
  else if (canRight) dir = 1;
  else dir = roomLeft > roomRight ? -1 : 1;

  return clampX(x + dir * dist, boundsWidth);
}

function pickMovement(
  behavior: PetBehavior,
  random: () => number,
): Pick<PetState, "movementAction" | "movementSpeedMultiplier"> {
  const options = behavior.movementActions;
  const choice = options[Math.floor(random() * options.length)];
  return {
    movementAction: choice?.name ?? "walk",
    movementSpeedMultiplier: choice?.speedMultiplier ?? 1,
  };
}

function pickIdle(
  behavior: PetBehavior,
  ts: number,
  random: () => number,
): Pick<PetState, "idleAction" | "idleActionUntil" | "idleCooldownUntil"> | null {
  const options = behavior.idleActions;
  const choice = options[Math.floor(random() * options.length)];
  if (!choice) return null;
  const until = ts + choice.baseDuration + random() * choice.extraDuration;
  return {
    idleAction: choice.name,
    idleActionUntil: until,
    idleCooldownUntil: until + behavior.idlePauseMs.min / 8,
  };
}

function schedulePause(
  behavior: PetBehavior,
  ts: number,
  random: () => number,
): number {
  const { min, max } = behavior.idlePauseMs;
  return ts + min + random() * Math.max(0, max - min);
}

function isHovered(state: PetState, input: PetInput, behavior: PetBehavior) {
  if (!input.mouse) return false;
  const centerX = state.x;
  const centerY = -input.sprite.height / 2; // sprite sits on the bottom edge
  const dist = Math.hypot(input.mouse.x - centerX, input.mouse.y - centerY);
  return dist <= behavior.hoverDist;
}

/**
 * Advance the pet by one tick.
 *
 * `random` is injectable so the machine can be driven deterministically.
 */
export function stepPet(
  prev: PetState,
  input: PetInput,
  behavior: PetBehavior,
  random: () => number = Math.random,
): PetState {
  const { ts, boundsWidth } = input;
  const next: PetState = { ...prev };

  // 1. Where are we heading?
  let targetX: number;
  if (behavior.followMouse) {
    targetX = input.mouse?.x ?? next.x;
    next.targetX = null;
  } else if (ts < next.pauseUntil) {
    targetX = next.x;
  } else {
    if (next.targetX === null) {
      Object.assign(next, pickMovement(behavior, random));
      next.targetX = pickWanderTarget(next.x, boundsWidth, random);
    }
    targetX = next.targetX;
  }

  const diffX = targetX - next.x;
  const distX = Math.abs(diffX);
  if (distX > 0.5) next.facing = diffX < 0 ? -1 : 1;

  const arrived = distX < behavior.idleDist;
  if (arrived && next.targetX !== null) {
    next.targetX = null;
    next.pauseUntil = schedulePause(behavior, ts, random);
  }

  // 2. Which mode are we in?
  if (isHovered(next, input, behavior)) {
    next.mode = "hover";
    next.action = resolveAction(behavior, behavior.hoverAction);
    return next;
  }

  if (arrived) {
    next.mode = "idle";
    if (ts > next.idleCooldownUntil && ts > next.idleActionUntil) {
      Object.assign(next, pickIdle(behavior, ts, random) ?? {});
    }
    next.action = resolveAction(behavior, next.idleAction);
    return next;
  }

  // 3. Walking.
  next.mode = "walking";
  const step = behavior.speed * next.movementSpeedMultiplier;
  next.x = clampX(next.x + Math.sign(diffX) * Math.min(step, distX), boundsWidth);
  next.idleAction = defaultIdleAction(behavior);
  next.idleActionUntil = 0;
  next.idleCooldownUntil = 0;
  next.action = resolveAction(behavior, next.movementAction);
  return next;
}

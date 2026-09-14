"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, Ref, RefObject } from "react";

import { PET_MANIFEST } from "@/lib/pet-manifest";
import {
  createPetState,
  defaultIdleAction,
  DEFAULT_PET_BEHAVIOR,
  resolveAction,
  stepPet,
} from "@/lib/web-pet-engine";
import type { PetBehavior, PetMode, PetState } from "@/lib/web-pet-engine";

export type { PetBehavior, PetIdleAction, PetMovementAction } from "@/lib/web-pet-engine";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type WebPetProps = {
  /** Folder name under `mediaBaseUrl`, e.g. "dog". */
  animal: string;
  /** Color variant, e.g. "brown". Defaults to the animal's first color. */
  color?: string;
  /** `fixed` roams the viewport; `absolute` roams its offset parent. */
  position?: "fixed" | "absolute";
  /** Base movement speed in px per tick. Defaults to the animal's tuned speed. */
  speed?: number;
  /** Render scale of the 100x100 GIF. */
  scale?: number;
  /** Chase the cursor instead of wandering. */
  followMouse?: boolean;
  /** Text shown in a speech bubble while the cursor is near the pet. */
  hoverMessage?: string;
  zIndex?: number;
  style?: CSSProperties;
  /** Where the GIFs are served from. Defaults to "/media". */
  mediaBaseUrl?: string;
  /** Fine-grained behavior knobs; anything omitted uses sensible defaults. */
  behavior?: Partial<
    Pick<
      PetBehavior,
      | "idleDist"
      | "hoverAction"
      | "hoverDist"
      | "idlePauseMs"
      | "actions"
      | "idleActions"
      | "movementActions"
    >
  >;
  speech?: {
    maxWidth?: number;
    offsetY?: number;
  };
  /**
   * Make the pet clickable. The wrapper becomes a button and stops letting
   * pointer events pass through to the page beneath it.
   */
  onClick?: () => void;
  /** Freeze movement, e.g. while a menu anchored to the pet is open. */
  paused?: boolean;
  /** The wrapper element, useful for anchoring a popover to the pet. */
  ref?: Ref<HTMLDivElement>;
};

/** Base speed for an animal, from the generated manifest. */
export function getWebPetSpeed(animal: string, fallback = DEFAULT_PET_BEHAVIOR.speed) {
  return PET_MANIFEST[animal]?.speed ?? fallback;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

type WebPetConfig = {
  behavior: PetBehavior;
  gifUrl: (action: string) => string;
  scale: number;
  paused: boolean;
};

const SPRITE_SIZE_PX = 100;
const TICK_MS = 125;
const BUBBLE_GAP_PX = 6;
const DEFAULT_SCALE = 0.5;
const DEFAULT_Z_INDEX = 9999;
const DEFAULT_MEDIA_BASE_URL = "/media";
const DEFAULT_SPEECH = { maxWidth: 160, offsetY: 0 };

function resolveConfig(props: WebPetProps): WebPetConfig {
  const manifest = PET_MANIFEST[props.animal];
  const overrides = props.behavior ?? {};
  const colors = manifest?.colors ?? [];
  // Unknown colors fall back to a real one so we never request a missing GIF.
  const color =
    props.color && (colors.length === 0 || colors.includes(props.color))
      ? props.color
      : (colors[0] ?? "brown");
  const base = (props.mediaBaseUrl ?? DEFAULT_MEDIA_BASE_URL).replace(/\/$/, "");

  const behavior: PetBehavior = {
    ...DEFAULT_PET_BEHAVIOR,
    ...overrides,
    actions: overrides.actions ?? manifest?.actions ?? DEFAULT_PET_BEHAVIOR.actions,
    speed: props.speed ?? manifest?.speed ?? DEFAULT_PET_BEHAVIOR.speed,
    followMouse: props.followMouse ?? DEFAULT_PET_BEHAVIOR.followMouse,
  };

  return {
    behavior,
    scale: props.scale ?? DEFAULT_SCALE,
    paused: props.paused ?? false,
    gifUrl: (action) =>
      `${base}/${props.animal}/${color}_${resolveAction(behavior, action)}_8fps.gif`,
  };
}

// ---------------------------------------------------------------------------
// Shared cursor tracking (one listener for every pet on the page)
// ---------------------------------------------------------------------------

const cursor = { x: 0, y: 0, known: false };
let cursorSubscribers = 0;

function onPointerMove(event: PointerEvent) {
  cursor.x = event.clientX;
  cursor.y = event.clientY;
  cursor.known = true;
}

function subscribeCursor(): () => void {
  if (cursorSubscribers === 0) {
    document.addEventListener("pointermove", onPointerMove, { passive: true });
  }
  cursorSubscribers += 1;
  return () => {
    cursorSubscribers -= 1;
    if (cursorSubscribers === 0) {
      document.removeEventListener("pointermove", onPointerMove);
    }
  };
}

// ---------------------------------------------------------------------------
// Animation loop: reads the world, steps the engine, paints the DOM
// ---------------------------------------------------------------------------

type Bounds = { left: number; bottom: number; width: number };

/**
 * The box the pet roams in. Derived from where the wrapper actually landed,
 * because `position: fixed` gets re-parented by any ancestor with a transform,
 * filter, or backdrop-filter (a blurred sticky header, for example).
 */
function readBounds(wrapper: HTMLElement, position: "fixed" | "absolute"): Bounds {
  const rect = wrapper.getBoundingClientRect();
  const left = rect.left - (parseFloat(wrapper.style.left) || 0);
  const bottom = rect.bottom;

  const atViewportBottom = Math.abs(bottom - window.innerHeight) < 1;
  const container =
    position === "absolute"
      ? (wrapper.offsetParent ?? wrapper.parentElement)
      : atViewportBottom
        ? null
        : wrapper.parentElement;

  const width = container
    ? container.getBoundingClientRect().width
    : window.innerWidth;

  return { left, bottom, width };
}

function paint(
  wrapper: HTMLElement,
  sprite: HTMLElement,
  state: PetState,
  config: WebPetConfig,
  painted: { src: string | null; facing: number | null },
) {
  const width = SPRITE_SIZE_PX * config.scale;
  wrapper.style.left = `${state.x - width / 2}px`;

  const src = config.gifUrl(state.action);
  if (painted.src !== src) {
    painted.src = src;
    sprite.style.backgroundImage = `url("${src}")`;
  }
  if (painted.facing !== state.facing) {
    painted.facing = state.facing;
    sprite.style.transform = `scaleX(${state.facing})`;
  }
}

function useWebPetLoop(
  wrapperRef: RefObject<HTMLDivElement | null>,
  spriteRef: RefObject<HTMLDivElement | null>,
  config: WebPetConfig,
  position: "fixed" | "absolute",
  onModeChange: (mode: PetMode) => void,
) {
  // The loop reads the latest config each tick, so prop changes never restart it.
  const configRef = useRef(config);
  const positionRef = useRef(position);
  useEffect(() => {
    configRef.current = config;
    positionRef.current = position;
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const sprite = spriteRef.current;
    if (!wrapper || !sprite) return;

    let state = createPetState(configRef.current.behavior);
    const painted = { src: null as string | null, facing: null as number | null };
    let lastMode: PetMode | null = null;
    let lastTick = 0;
    let frame: number | null = null;

    const tick = (ts: number) => {
      frame = requestAnimationFrame(tick);
      if (ts - lastTick < TICK_MS) return;
      lastTick = ts;

      const current = configRef.current;
      if (current.paused) return;
      const bounds = readBounds(wrapper, positionRef.current);
      const size = SPRITE_SIZE_PX * current.scale;

      state = stepPet(
        state,
        {
          ts,
          boundsWidth: bounds.width,
          mouse: cursor.known
            ? { x: cursor.x - bounds.left, y: cursor.y - bounds.bottom }
            : null,
          sprite: { width: size, height: size },
        },
        current.behavior,
      );

      paint(wrapper, sprite, state, current, painted);
      if (state.mode !== lastMode) {
        lastMode = state.mode;
        onModeChange(state.mode);
      }
    };

    paint(wrapper, sprite, state, configRef.current, painted);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const unsubscribe = subscribeCursor();
    frame = requestAnimationFrame(tick);

    return () => {
      unsubscribe();
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [wrapperRef, spriteRef, onModeChange]);
}

// ---------------------------------------------------------------------------
// Speech bubble anchoring: find where the sprite's head is
// ---------------------------------------------------------------------------

/** Fraction of the GIF height that is transparent above the sprite, per URL. */
const headPaddingCache = new Map<string, Promise<number | null>>();

function measureHeadPadding(src: string): Promise<number | null> {
  const cached = headPaddingCache.get(src);
  if (cached) return cached;

  const promise = new Promise<number | null>((resolve) => {
    const image = new Image();
    // Lets the canvas read pixels from a CDN that sends CORS headers.
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx || canvas.height === 0) return resolve(null);
        ctx.drawImage(image, 0, 0);
        const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            if (data[(y * width + x) * 4 + 3] > 10) return resolve(y / height);
          }
        }
        resolve(0);
      } catch {
        resolve(null);
      }
    };
    image.onerror = () => resolve(null);
    image.src = src;
  });

  headPaddingCache.set(src, promise);
  return promise;
}

function useBubbleAnchor(src: string, spriteHeight: number): number | undefined {
  const [padding, setPadding] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    measureHeadPadding(src).then((value) => {
      if (!cancelled) setPadding(value);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (padding === null) return undefined;
  return Math.round(spriteHeight * (1 - padding) + BUBBLE_GAP_PX);
}

// ---------------------------------------------------------------------------
// Presentation
// ---------------------------------------------------------------------------

type SpeechBubbleProps = {
  text: string;
  maxWidth: number;
  offsetY: number;
  anchorBottomPx?: number;
};

function SpeechBubble({ text, maxWidth, offsetY, anchorBottomPx }: SpeechBubbleProps) {
  const tail: CSSProperties = {
    position: "absolute",
    top: "100%",
    left: "50%",
    width: 0,
    height: 0,
  };

  return (
    <div
      role="status"
      style={{
        position: "absolute",
        left: "50%",
        bottom: anchorBottomPx !== undefined ? `${anchorBottomPx}px` : "100%",
        transform: `translate(-50%, ${offsetY}px)`,
        padding: "6px 8px",
        maxWidth: `${maxWidth}px`,
        borderRadius: "var(--radius, 8px)",
        border: "1px solid var(--border, #d4d4d8)",
        background: "var(--popover, #fff)",
        color: "var(--popover-foreground, #18181b)",
        fontFamily: "var(--font-pixel, inherit)",
        fontSize: "12px",
        lineHeight: 1.2,
        textAlign: "center",
        boxShadow: "var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.15))",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {text}
      <div
        aria-hidden
        style={{
          ...tail,
          transform: "translateX(-50%)",
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "7px solid var(--border, #d4d4d8)",
        }}
      />
      <div
        aria-hidden
        style={{
          ...tail,
          transform: "translateX(-50%) translateY(-1px)",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid var(--popover, #fff)",
        }}
      />
    </div>
  );
}

export function WebPet(props: WebPetProps) {
  const {
    position = "fixed",
    zIndex = DEFAULT_Z_INDEX,
    style,
    hoverMessage,
    speech,
    onClick,
    ref,
  } = props;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const setWrapperRef = (el: HTMLDivElement | null) => {
    wrapperRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };
  const onKeyDown = onClick
    ? (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }
    : undefined;
  const spriteRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<PetMode>("idle");

  // Cheap to rebuild every render; the loop reads it through a ref, so
  // identity changes never restart the animation.
  const config = resolveConfig(props);

  const sizePx = SPRITE_SIZE_PX * config.scale;
  const idleGif = config.gifUrl(defaultIdleAction(config.behavior));
  const hoverGif = config.gifUrl(config.behavior.hoverAction);

  useWebPetLoop(wrapperRef, spriteRef, config, position, setMode);
  const bubbleAnchor = useBubbleAnchor(hoverGif, sizePx);

  const message = hoverMessage?.trim() ?? "";
  const showBubble = mode === "hover" && message.length > 0;

  return (
    <div
      ref={setWrapperRef}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${props.animal} pet` : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
      style={{
        position,
        bottom: 0,
        left: 0,
        height: `${sizePx}px`,
        width: `${sizePx}px`,
        zIndex,
        pointerEvents: onClick ? "auto" : "none",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {showBubble ? (
        <SpeechBubble
          text={message}
          maxWidth={speech?.maxWidth ?? DEFAULT_SPEECH.maxWidth}
          offsetY={speech?.offsetY ?? DEFAULT_SPEECH.offsetY}
          anchorBottomPx={bubbleAnchor}
        />
      ) : null}
      <div
        ref={spriteRef}
        style={{
          height: "100%",
          width: "100%",
          backgroundImage: `url("${idleGif}")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom center",
          backgroundSize: "contain",
          imageRendering: "pixelated",
          transformOrigin: "bottom center",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

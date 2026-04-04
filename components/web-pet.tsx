"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode, RefObject } from "react";

type Size = { w: number; h: number };

type WebPetIdleAction = {
  name: string;
  baseDuration: number;
  extraDuration: number;
};

type WebPetMovementAction = {
  name: string;
  speedMultiplier: number;
};

type WebPetConfig = {
  mediaFolder: string;
  defaultColor: string;
  spriteSize: Size;
  scale?: number;
  speed: number;
  idleDist: number;
  hoverAction: string;
  hoverDist: number;
  idlePauseMs: { min: number; max: number };
  followMouse: boolean;
  actions: string[];
  idleActions: WebPetIdleAction[];
  movementActions: WebPetMovementAction[];
};

export type WebPetProps = {
  animal: string;
  color?: string;
  position?: "fixed" | "absolute";
  speed?: number;
  scale?: number;
  followMouse?: boolean;
  behavior?: WebPetBehaviorOptions;
  appearance?: WebPetAppearanceOptions;
  speech?: WebPetSpeechInput;
  hoverMessage?: string;
};

type WebPetBehaviorOptions = Partial<
  Pick<
    WebPetConfig,
    | "speed"
    | "scale"
    | "idleDist"
    | "hoverAction"
    | "hoverDist"
    | "idlePauseMs"
    | "followMouse"
    | "actions"
    | "idleActions"
    | "movementActions"
  >
>;

type WebPetAppearanceOptions = {
  position?: "fixed" | "absolute";
  zIndex?: number;
  style?: CSSProperties;
};

type WebPetSpeechOptions = {
  maxWidth?: number;
  offsetY?: number;
};

type WebPetSpeechInput = WebPetSpeechOptions | null;

type ResolvedSpeechConfig = {
  maxWidth: number;
  offsetY: number;
};

const DEFAULT_SPRITE_SIZE: Size = { w: 100, h: 100 };

const DEFAULT_BEHAVIOR = {
  actions: ["idle", "run", "swipe", "walk", "walk_fast", "with_ball"],
  hoverAction: "swipe",
  hoverDist: 50,
  idleActions: [
    { name: "idle", baseDuration: 2500, extraDuration: 2000 },
    { name: "swipe", baseDuration: 1200, extraDuration: 800 },
  ],
  idleDist: 48,
  idlePauseMs: { min: 1500, max: 2200 },
  movementActions: [
    { name: "walk", speedMultiplier: 1.0 },
    { name: "walk_fast", speedMultiplier: 1.35 },
    { name: "run", speedMultiplier: 1.8 },
  ],
  speed: 4.5,
  scale: 0.5,
  followMouse: false,
} satisfies Required<WebPetBehaviorOptions>;

const DEFAULT_APPEARANCE = {
  position: "fixed" as const,
  zIndex: 9999,
};

const DEFAULT_SPEECH_CONFIG: ResolvedSpeechConfig = {
  maxWidth: 160,
  offsetY: 0,
};

const BUBBLE_GAP_PX = 6;

export const WEB_PET_ACTIONS = DEFAULT_BEHAVIOR.actions;

const WEB_PET_SPEEDS: Record<string, number> = {
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

export function getWebPetSpeed(animal: string, fallback: number): number {
  return WEB_PET_SPEEDS[animal] ?? fallback;
}

function resolveAction(config: WebPetConfig, action: string): string {
  return config.actions.includes(action) ? action : (config.actions[0] ?? action);
}

function getGifUrl(config: WebPetConfig, action: string): string {
  const resolvedAction = resolveAction(config, action);
  return `/media/${config.mediaFolder}/${config.defaultColor}_${resolvedAction}_8fps.gif`;
}

function resolveBehavior(options: {
  animal: string;
  speed?: number;
  scale?: number;
  followMouse: boolean;
  behavior?: WebPetBehaviorOptions;
}): Required<WebPetBehaviorOptions> {
  const overrides = options.behavior ?? {};

  return {
    actions: overrides.actions ?? DEFAULT_BEHAVIOR.actions,
    hoverAction: overrides.hoverAction ?? DEFAULT_BEHAVIOR.hoverAction,
    hoverDist: overrides.hoverDist ?? DEFAULT_BEHAVIOR.hoverDist,
    idleActions: overrides.idleActions ?? DEFAULT_BEHAVIOR.idleActions,
    idleDist: overrides.idleDist ?? DEFAULT_BEHAVIOR.idleDist,
    idlePauseMs: overrides.idlePauseMs ?? DEFAULT_BEHAVIOR.idlePauseMs,
    movementActions: overrides.movementActions ?? DEFAULT_BEHAVIOR.movementActions,
    speed:
      overrides.speed ??
      options.speed ??
      getWebPetSpeed(options.animal, DEFAULT_BEHAVIOR.speed),
    scale: overrides.scale ?? options.scale ?? DEFAULT_BEHAVIOR.scale,
    followMouse:
      overrides.followMouse ??
      options.followMouse ??
      DEFAULT_BEHAVIOR.followMouse,
  };
}

function resolveAppearance(
  position: WebPetProps["position"],
  appearance?: WebPetAppearanceOptions,
): Required<WebPetAppearanceOptions> {
  return {
    position: appearance?.position ?? position ?? DEFAULT_APPEARANCE.position,
    zIndex: appearance?.zIndex ?? DEFAULT_APPEARANCE.zIndex,
    style: appearance?.style ?? {},
  };
}

function resolveSpeechConfig(speech?: WebPetSpeechInput): ResolvedSpeechConfig {
  return {
    maxWidth: speech?.maxWidth ?? DEFAULT_SPEECH_CONFIG.maxWidth,
    offsetY: speech?.offsetY ?? DEFAULT_SPEECH_CONFIG.offsetY,
  };
}

function resolveWebPetConfig(options: {
  animal: string;
  color: string;
  speed?: number;
  scale?: number;
  followMouse: boolean;
  behavior?: WebPetBehaviorOptions;
}): WebPetConfig {
  const behavior = resolveBehavior(options);

  return {
    mediaFolder: options.animal,
    defaultColor: options.color,
    spriteSize: DEFAULT_SPRITE_SIZE,
    ...behavior,
  };
}

function getScaledSize(size: Size, scale: number): Size {
  return { w: size.w * scale, h: size.h * scale };
}

type WebPetContainerProps = {
  position: "fixed" | "absolute";
  size: Size;
  zIndex: number;
  style?: CSSProperties;
  children: ReactNode;
};

const WebPetContainer = forwardRef<HTMLDivElement, WebPetContainerProps>(
  ({ position, size, zIndex, style, children }, ref) => (
    <div
      ref={ref}
      style={{
        position,
        bottom: "0px",
        left: "0px",
        height: `${size.h}px`,
        width: `${size.w}px`,
        zIndex,
        pointerEvents: "none",
        transformOrigin: "bottom center",
        ...style,
      }}
    >
      {children}
    </div>
  ),
);

WebPetContainer.displayName = "WebPetContainer";

type WebPetSpeechBubbleProps = {
  visible: boolean;
  text: string;
  maxWidth: number;
  offsetY: number;
  anchorBottomPx?: number;
};

function WebPetSpeechBubble({
  visible,
  text,
  maxWidth,
  offsetY,
  anchorBottomPx,
}: WebPetSpeechBubbleProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: anchorBottomPx !== undefined ? `${anchorBottomPx}px` : "100%",
        transform: `translate(-50%, ${offsetY}px)`,
        padding: "6px 8px",
        maxWidth: `${maxWidth}px`,
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        background: "var(--popover)",
        color: "var(--popover-foreground)",
        fontFamily: "var(--font-pixel), sans-serif",
        fontSize: "12px",
        lineHeight: 1.2,
        textAlign: "center",
        boxShadow: "var(--shadow-sm)",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {text}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          width: 0,
          height: 0,
          transform: "translateX(-50%)",
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "7px solid var(--border)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          width: 0,
          height: 0,
          transform: "translateX(-50%) translateY(-1px)",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid var(--popover)",
        }}
      />
    </div>
  );
}

type WebPetSpriteProps = {
  initialGif: string;
};

const WebPetSprite = forwardRef<HTMLDivElement, WebPetSpriteProps>(
  ({ initialGif }, ref) => (
    <div
      ref={ref}
      style={{
        height: "100%",
        width: "100%",
        backgroundImage: `url("${initialGif}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom center",
        backgroundSize: "contain",
        imageRendering: "pixelated",
        transform: "scaleX(1)",
        transformOrigin: "bottom center",
        pointerEvents: "none",
      }}
    />
  ),
);

WebPetSprite.displayName = "WebPetSprite";

function findTopOpaqueRow(imageData: ImageData): number {
  const { data, width, height } = imageData;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 10) return y;
    }
  }

  return 0;
}

function useSpeechAnchorBottom(initialGif: string, spriteHeight: number) {
  const [anchorBottomPx, setAnchorBottomPx] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) return;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        if (canvas.height === 0) {
          setAnchorBottomPx(undefined);
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setAnchorBottomPx(undefined);
          return;
        }

        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const topOpaqueRow = findTopOpaqueRow(imageData);
        const topPaddingScaled = (topOpaqueRow / canvas.height) * spriteHeight;
        const headAnchorBottom = spriteHeight - topPaddingScaled;

        setAnchorBottomPx(Math.round(headAnchorBottom + BUBBLE_GAP_PX));
      } catch {
        setAnchorBottomPx(undefined);
      }
    };

    image.onerror = () => {
      if (!cancelled) setAnchorBottomPx(undefined);
    };

    image.src = initialGif;

    return () => {
      cancelled = true;
    };
  }, [initialGif, spriteHeight]);

  return anchorBottomPx;
}

function useWebPetAnimation(
  wrapperRef: RefObject<HTMLDivElement | null>,
  spriteRef: RefObject<HTMLDivElement | null>,
  config: WebPetConfig,
  onHoverChange?: (isHovered: boolean) => void,
): void {
  const mousePos = useRef({ x: 0, y: 0 });
  const animalPos = useRef({ x: 10, y: 0 });
  const animationId = useRef<number | null>(null);
  const idleAction = useRef<string>("idle");
  const idleActionUntil = useRef(0);
  const idleCooldownUntil = useRef(0);
  const movementAction = useRef<string>("walk");
  const movementSpeedMultiplier = useRef(1);
  const movementPauseUntil = useRef(0);
  const movementTargetX = useRef<number | null>(null);
  const facingDir = useRef<1 | -1>(1);
  const lastStepTime = useRef(0);
  const lastGifSrc = useRef<string | null>(null);
  const hoverState = useRef(false);

  useEffect(() => {
    const {
      speed,
      idleDist,
      hoverAction,
      hoverDist,
      idlePauseMs,
      idleActions,
      movementActions,
      followMouse,
    } = config;

    lastGifSrc.current = null;
    idleAction.current = idleActions[0]?.name ?? "idle";

    function setGif(action: string) {
      if (!spriteRef.current) return;
      const src = getGifUrl(config, action);
      if (lastGifSrc.current === src) return;
      lastGifSrc.current = src;
      spriteRef.current.style.backgroundImage = `url("${src}")`;
    }

    function applyFacingTransform() {
      if (!spriteRef.current) return;
      spriteRef.current.style.transform = `scaleX(${facingDir.current})`;
    }

    function updateHoverState(rect: DOMRect | null) {
      const hovered =
        !!rect &&
        mousePos.current.x >= rect.left &&
        mousePos.current.x <= rect.right &&
        mousePos.current.y >= rect.top &&
        mousePos.current.y <= rect.bottom;

      if (hovered === hoverState.current) return;
      hoverState.current = hovered;
      onHoverChange?.(hovered);
    }

    function pickIdleAction(ts: number) {
      if (idleActions.length === 0) return;
      const action = idleActions[Math.floor(Math.random() * idleActions.length)];
      if (!action) return;
      idleAction.current = action.name;
      idleActionUntil.current =
        ts + action.baseDuration + Math.random() * action.extraDuration;
      idleCooldownUntil.current = idleActionUntil.current + idlePauseMs.min / 8;
    }

    function pickMovementAction() {
      if (movementActions.length === 0) {
        movementAction.current = "walk";
        movementSpeedMultiplier.current = 1;
        return;
      }
      const action =
        movementActions[Math.floor(Math.random() * movementActions.length)];
      if (!action) return;
      movementAction.current = action.name;
      movementSpeedMultiplier.current = action.speedMultiplier;
    }

    function scheduleMovementPause(ts: number) {
      const extra = Math.max(0, idlePauseMs.max - idlePauseMs.min);
      movementPauseUntil.current = ts + idlePauseMs.min + Math.random() * extra;
    }

    function pickMovementTarget(x: number, boundsWidth: number) {
      const margin = 16;
      const maxX = Math.max(margin, boundsWidth - margin);
      const availableLeft = Math.max(0, x - margin);
      const availableRight = Math.max(0, maxX - x);
      const minDist = boundsWidth * 0.2;
      const maxDist = boundsWidth * 0.55;
      const dist = minDist + Math.random() * Math.max(0, maxDist - minDist);

      const canLeft = availableLeft >= dist;
      const canRight = availableRight >= dist;

      let dir: 1 | -1;
      if (canLeft && canRight) {
        dir = Math.random() < 0.5 ? -1 : 1;
      } else if (canLeft) {
        dir = -1;
      } else if (canRight) {
        dir = 1;
      } else {
        dir = availableLeft > availableRight ? -1 : 1;
      }

      movementTargetX.current = Math.min(
        maxX,
        Math.max(margin, x + dir * dist),
      );
    }

    function animate(ts: number) {
      const stepMs = 125;
      if (ts - lastStepTime.current < stepMs) {
        animationId.current = requestAnimationFrame(animate);
        return;
      }

      lastStepTime.current = ts;
      let { x } = animalPos.current;
      const rect = wrapperRef.current?.getBoundingClientRect();
      const parentRect =
        wrapperRef.current?.parentElement?.getBoundingClientRect() ??
        ({ left: 0, width: window.innerWidth } as DOMRect);
      const parentWidth = parentRect.width;
      const spriteWidth =
        rect?.width ?? config.spriteSize.w * (config.scale ?? DEFAULT_BEHAVIOR.scale);

      let targetX: number;
      if (followMouse) {
        targetX = mousePos.current.x - parentRect.left;
      } else if (ts < movementPauseUntil.current) {
        targetX = x;
      } else {
        if (movementTargetX.current === null) {
          pickMovementAction();
          pickMovementTarget(x, parentWidth);
        }
        targetX = movementTargetX.current ?? x;
      }

      const diffX = targetX - x;
      const distX = Math.abs(diffX) || 0.0001;
      const idle = distX < idleDist;

      if (Math.abs(diffX) > 0.5) {
        facingDir.current = diffX < 0 ? -1 : 1;
      }

      const centerX = rect ? rect.left + rect.width / 2 : x;
      const centerY = rect ? rect.top + rect.height / 2 : window.innerHeight - 1;
      const distToMouse = Math.hypot(
        mousePos.current.x - centerX,
        mousePos.current.y - centerY,
      );

      if (distToMouse <= hoverDist) {
        setGif(hoverAction);
        applyFacingTransform();
      } else if (idle) {
        idleAction.current = resolveAction(config, idleAction.current);

        if (!followMouse && movementTargetX.current !== null) {
          movementTargetX.current = null;
          scheduleMovementPause(ts);
        }

        if (ts > idleCooldownUntil.current && ts > idleActionUntil.current) {
          pickIdleAction(ts);
        }

        setGif(idleAction.current);
      } else {
        x += (diffX / distX) * speed * movementSpeedMultiplier.current;
        x = Math.min(Math.max(16, x), parentWidth - 16);
        animalPos.current = { x, y: 0 };

        if (!followMouse && movementTargetX.current !== null && distX <= idleDist) {
          movementTargetX.current = null;
          scheduleMovementPause(ts);
        }

        if (idleActions.length > 0) {
          idleAction.current = resolveAction(config, idleActions[0]?.name ?? "idle");
        }
        idleActionUntil.current = 0;
        idleCooldownUntil.current = 0;

        setGif(movementAction.current);
        applyFacingTransform();
      }

      if (wrapperRef.current) {
        wrapperRef.current.style.left = `${x - spriteWidth / 2}px`;
      }

      if (idle) {
        applyFacingTransform();
      }

      updateHoverState(rect ?? null);
      animationId.current = requestAnimationFrame(animate);
    }

    function handleMouseMove(e: MouseEvent) {
      mousePos.current = { x: e.clientX, y: e.clientY };
      updateHoverState(wrapperRef.current?.getBoundingClientRect() ?? null);
    }

    document.addEventListener("mousemove", handleMouseMove);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      animationId.current = requestAnimationFrame(animate);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [config, onHoverChange, spriteRef, wrapperRef]);
}

export function WebPet({
  animal,
  color = "brown",
  position = "fixed",
  speed,
  scale,
  followMouse = false,
  behavior,
  appearance,
  speech,
  hoverMessage,
}: WebPetProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const spriteRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(
    () =>
      resolveWebPetConfig({
        animal,
        color,
        speed,
        scale,
        followMouse,
        behavior,
      }),
    [animal, color, speed, scale, followMouse, behavior],
  );

  const resolvedAppearance = useMemo(
    () => resolveAppearance(position, appearance),
    [position, appearance],
  );

  const speechConfig = useMemo(() => resolveSpeechConfig(speech), [speech]);

  const scaledSize = useMemo(
    () => getScaledSize(config.spriteSize, config.scale ?? DEFAULT_BEHAVIOR.scale),
    [config.scale, config.spriteSize],
  );

  const initialGif = useMemo(
    () => getGifUrl(config, config.hoverAction),
    [config],
  );

  const speechAnchorBottomPx = useSpeechAnchorBottom(initialGif, scaledSize.h);

  useWebPetAnimation(wrapperRef, spriteRef, config, setIsHovered);

  const message = hoverMessage?.trim() ?? "";
  const showBubble = isHovered && message.length > 0;

  return (
    <WebPetContainer
      ref={wrapperRef}
      position={resolvedAppearance.position}
      size={scaledSize}
      zIndex={resolvedAppearance.zIndex}
      style={resolvedAppearance.style}
    >
      <WebPetSpeechBubble
        visible={showBubble}
        text={message}
        maxWidth={speechConfig.maxWidth}
        offsetY={speechConfig.offsetY}
        anchorBottomPx={speechAnchorBottomPx}
      />
      <WebPetSprite ref={spriteRef} initialGif={initialGif} />
    </WebPetContainer>
  );
}

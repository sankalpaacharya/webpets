"use client";

import { useEffect, useRef } from "react";
import type { AnimalConfig } from "./types";

/**
 * Drives the pet animation loop for any animal.
 * All behaviour is derived from the supplied `AnimalConfig`.
 */
export function usePetAnimation(
    ref: React.RefObject<HTMLDivElement | null>,
    config: AnimalConfig,
): void {
    // ── Stable refs for mutable animation state ──────────────────────────
    const mousePos = useRef({ x: 0, y: 0 });
    const animalPos = useRef({ x: 10, y: 0 });
    const frameCount = useRef(0);
    const lastFrameTime = useRef(0);
    const hoverFrameCount = useRef(0);
    const hoverLastFrameTime = useRef(0);
    const idleFrameCount = useRef(0);
    const idleLastFrameTime = useRef(0);
    const animationId = useRef<number | null>(null);
    const idleAction = useRef<string>("motion");
    const idleActionUntil = useRef(0);
    const idleCooldownUntil = useRef(0);
    const movementAction = useRef<string>("e");
    const movementSpeedMultiplier = useRef(1);
    const movementPauseUntil = useRef(0);
    const movementTargetX = useRef<number | null>(null);
    const facingDir = useRef<1 | -1>(1);

    useEffect(() => {
        const {
            speed,
            idleDist,
            hoverAction,
            hoverDist,
            frameMs,
            movementFrameMs,
            hoverFrameMs,
            idleActionFrameMs,
            idleCooldownPadding,
            idlePauseMs,
            scale: configScale,
            sprites,
            idleActions,
            movementActions,
            followMouse,
        } = config;
        const scale = configScale ?? 1;
        const MOVE_PAUSE_MIN = idlePauseMs.min;
        const MOVE_PAUSE_MAX = idlePauseMs.max;
        const MOVE_DIST_MIN_RATIO = 0.2;
        const MOVE_DIST_MAX_RATIO = 0.55;

        if (idleActions.length > 0) {
            idleAction.current = idleActions[0].name;
        }

        // ── Helpers ──────────────────────────────────────────────────────────

        function setSprite(name: string, frame: number) {
            if (!ref.current) return;
            const frames = sprites[name];
            if (!frames || frames.length === 0) return;
            const [x, y] = frames[frame % frames.length];
            ref.current.style.backgroundPosition = `${x}px ${y}px`;
        }

        function pickIdleAction(ts: number) {
            const index = Math.floor(Math.random() * idleActions.length);
            const action = idleActions[index];
            if (!action) return;
            idleAction.current = action.name;
            idleActionUntil.current =
                ts + action.baseDuration + Math.random() * action.extraDuration;
            idleCooldownUntil.current =
                idleActionUntil.current + idleCooldownPadding;
        }

        function pickMovementAction() {
            const index = Math.floor(Math.random() * movementActions.length);
            const action = movementActions[index];
            if (!action) return;
            movementAction.current = action.name;
            movementSpeedMultiplier.current = action.speedMultiplier;
        }

        function scheduleMovementPause(ts: number) {
            const extra = Math.max(0, MOVE_PAUSE_MAX - MOVE_PAUSE_MIN);
            movementPauseUntil.current = ts + MOVE_PAUSE_MIN + Math.random() * extra;
        }

        function pickMovementTarget(x: number, boundsWidth: number) {
            const margin = 16;
            const maxX = Math.max(margin, boundsWidth - margin);
            const availableLeft = Math.max(0, x - margin);
            const availableRight = Math.max(0, maxX - x);
            const minDist = boundsWidth * MOVE_DIST_MIN_RATIO;
            const maxDist = boundsWidth * MOVE_DIST_MAX_RATIO;
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

        function resolveMoveSprite(baseName: string, diffX: number) {
            const left = diffX < 0;
            const directional = left ? `${baseName}_w` : `${baseName}_e`;
            if (sprites[directional]) {
                return { name: directional, flip: false };
            }
            if (baseName === "e" && left && sprites.w) {
                return { name: "w", flip: false };
            }
            if (baseName === "w" && !left && sprites.e) {
                return { name: "e", flip: false };
            }
            return { name: baseName, flip: left };
        }

        // ── Main loop ────────────────────────────────────────────────────────

        function animate(ts: number) {
            let { x } = animalPos.current;
            const rect = ref.current?.getBoundingClientRect();
            const parentWidth =
                ref.current?.parentElement?.getBoundingClientRect().width ??
                window.innerWidth;
            const spriteWidth = rect?.width ?? config.spriteSize.w;

            // ── Determine the target position ────────────────────────────────
            let targetX: number;

            if (followMouse) {
                targetX = mousePos.current.x;
            } else {
                if (ts < movementPauseUntil.current) {
                    targetX = x;
                } else {
                    if (movementTargetX.current === null) {
                        pickMovementAction();
                        pickMovementTarget(x, parentWidth);
                    }
                    targetX = movementTargetX.current ?? x;
                }
            }

            const diffX = targetX - x;
            const distX = Math.abs(diffX) || 0.0001;
            const idle = distX < idleDist;
            if (Math.abs(diffX) > 0.5) {
                facingDir.current = diffX < 0 ? -1 : 1;
            }

            // ── Hover-action detection ───────────────────────────────────────
            const centerX = rect ? rect.left + rect.width / 2 : x;
            const centerY = rect
                ? rect.top + rect.height / 2
                : window.innerHeight - 1;
            const distToMouse = Math.hypot(
                mousePos.current.x - centerX,
                mousePos.current.y - centerY,
            );
            const hoverTriggered = distToMouse <= hoverDist;

            // Tick frame counters
            if (ts - lastFrameTime.current > movementFrameMs) {
                frameCount.current++;
                lastFrameTime.current = ts;
            }
            if (ts - hoverLastFrameTime.current > hoverFrameMs) {
                hoverFrameCount.current++;
                hoverLastFrameTime.current = ts;
            }
            if (ts - idleLastFrameTime.current > idleActionFrameMs) {
                idleFrameCount.current++;
                idleLastFrameTime.current = ts;
            }

            // ── State machine ──────────────────────────────────────────────────

            if (hoverTriggered) {
                setSprite(hoverAction, hoverFrameCount.current);
                if (ref.current) {
                    ref.current.style.transform = `scale(${scale}) scaleX(${facingDir.current})`;
                }
            } else if (idle) {
                if (!sprites[idleAction.current] && idleActions.length > 0) {
                    idleAction.current = idleActions[0].name;
                }
                if (!followMouse && movementTargetX.current !== null) {
                    movementTargetX.current = null;
                    scheduleMovementPause(ts);
                }
                // Pick a random idle action when cooldown expires
                if (
                    ts > idleCooldownUntil.current &&
                    ts > idleActionUntil.current
                ) {
                    pickIdleAction(ts);
                }

                const currentIdle = idleActions.find(
                    (a) => a.name === idleAction.current,
                );
                const idleFrame =
                    currentIdle?.staticFrame ? 0 : idleFrameCount.current;
                setSprite(idleAction.current, idleFrame);
            } else {
                // ── Walking ────────────────────────────────────────────────────
                x += (diffX / distX) * speed * movementSpeedMultiplier.current;
                x = Math.min(Math.max(16, x), parentWidth - 16);
                animalPos.current = { x, y: 0 };
                if (!followMouse && movementTargetX.current !== null && distX <= idleDist) {
                    movementTargetX.current = null;
                    scheduleMovementPause(ts);
                }

                // Reset idle / hover state
                if (idleActions.length > 0) {
                    idleAction.current = idleActions[0].name;
                }
                idleActionUntil.current = 0;
                idleCooldownUntil.current = 0;
                hoverFrameCount.current = 0;
                hoverLastFrameTime.current = 0;
                idleFrameCount.current = 0;
                idleLastFrameTime.current = 0;

                const resolved = resolveMoveSprite(
                    movementAction.current,
                    diffX,
                );
                setSprite(resolved.name, frameCount.current);
                if (ref.current) {
                    const flip = resolved.flip ? -1 : 1;
                    ref.current.style.transform = `scale(${scale}) scaleX(${flip})`;
                }
            }

            // Position the element
            if (ref.current) {
                ref.current.style.left = `${x - spriteWidth / 2}px`;
                if (idle) {
                    ref.current.style.transform = `scale(${scale}) scaleX(${facingDir.current})`;
                }
            }

            animationId.current = requestAnimationFrame(animate);
        }

        // ── Event listeners & kick-off ───────────────────────────────────────

        function handleMouseMove(e: MouseEvent) {
            mousePos.current = { x: e.clientX, y: e.clientY };
        }

        const reduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        if (!reduced) {
            document.addEventListener("mousemove", handleMouseMove);
            animationId.current = requestAnimationFrame(animate);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            if (animationId.current) cancelAnimationFrame(animationId.current);
        };
    }, [config, ref]);
}

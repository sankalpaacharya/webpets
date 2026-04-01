"use client";

import { useEffect, useRef } from "react";
import type { GifAnimalConfig } from "./types";
import { getGifUrl, resolveGifAction } from "./gif-utils";

/**
 * Drives a GIF-based pet animation loop.
 * Uses the same movement logic but swaps whole GIFs per action.
 */
export function useGifPetAnimation(
    ref: React.RefObject<HTMLDivElement | null>,
    config: GifAnimalConfig | null,
    colorOverride?: string,
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

    useEffect(() => {
        if (!config) return;
        const activeConfig = config;

        const {
            speed,
            idleDist,
            hoverAction,
            hoverDist,
            idlePauseMs,
            scale: configScale,
            idleActions,
            movementActions,
            followMouse,
        } = activeConfig;
        const scale = configScale ?? 1;

        if (idleActions.length > 0) {
            idleAction.current = idleActions[0].name;
        }

        function setGif(name: string) {
            if (!ref.current) return;
            const src = getGifUrl(activeConfig, name, colorOverride);
            ref.current.style.backgroundImage = `url("${src}")`;
        }

        function pickIdleAction(ts: number) {
            const index = Math.floor(Math.random() * idleActions.length);
            const action = idleActions[index];
            if (!action) return;
            idleAction.current = action.name;
            idleActionUntil.current =
                ts + action.baseDuration + Math.random() * action.extraDuration;
            idleCooldownUntil.current =
                idleActionUntil.current + (idlePauseMs.min / 8);
        }

        function pickMovementAction() {
            const index = Math.floor(Math.random() * movementActions.length);
            const action = movementActions[index];
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
            const STEP_MS = 125;
            if (ts - lastStepTime.current < STEP_MS) {
                animationId.current = requestAnimationFrame(animate);
                return;
            }
            lastStepTime.current = ts;
            let { x } = animalPos.current;
            const rect = ref.current?.getBoundingClientRect();
            const parentRect =
                ref.current?.parentElement?.getBoundingClientRect() ??
                ({ left: 0, width: window.innerWidth } as DOMRect);
            const parentWidth = parentRect.width;
            const spriteWidth = rect?.width ?? activeConfig.spriteSize.w;

            let targetX: number;

            if (followMouse) {
                targetX = mousePos.current.x - parentRect.left;
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

            const centerX = rect ? rect.left + rect.width / 2 : x;
            const centerY = rect
                ? rect.top + rect.height / 2
                : window.innerHeight - 1;
            const distToMouse = Math.hypot(
                mousePos.current.x - centerX,
                mousePos.current.y - centerY,
            );
            const hoverTriggered = distToMouse <= hoverDist;

            if (hoverTriggered) {
                setGif(hoverAction);
                if (ref.current) {
                    ref.current.style.transform = `scale(${scale}) scaleX(${facingDir.current})`;
                }
            } else if (idle) {
                idleAction.current = resolveGifAction(
                    activeConfig,
                    idleAction.current,
                );
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
                    idleAction.current = resolveGifAction(
                        activeConfig,
                        idleActions[0].name,
                    );
                }
                idleActionUntil.current = 0;
                idleCooldownUntil.current = 0;

                setGif(movementAction.current);
                if (ref.current) {
                    ref.current.style.transform = `scale(${scale}) scaleX(${facingDir.current})`;
                }
            }

            if (ref.current) {
                ref.current.style.left = `${x - spriteWidth / 2}px`;
                if (idle) {
                    ref.current.style.transform = `scale(${scale}) scaleX(${facingDir.current})`;
                }
            }

            animationId.current = requestAnimationFrame(animate);
        }

        function handleMouseMove(e: MouseEvent) {
            mousePos.current = { x: e.clientX, y: e.clientY };
        }

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!reduced) {
            document.addEventListener("mousemove", handleMouseMove);
            animationId.current = requestAnimationFrame(animate);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            if (animationId.current) cancelAnimationFrame(animationId.current);
        };
    }, [config, colorOverride, ref]);
}

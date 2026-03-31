import type { GifAnimalConfig } from "../types";

const clippyBlack: GifAnimalConfig = {
    name: "clippy-black",
    spriteSize: { w: 112, h: 142 },
    scale: 1.5,
    speed: 4.5,
    idleDist: 48,
    hoverAction: "with_ball",
    hoverDist: 50,
    idlePauseMs: { min: 1500, max: 2200 },
    followMouse: false,

    actions: {
        idle: "/media/clippy/black_idle_8fps.gif",
        run: "/media/clippy/black_run_8fps.gif",
        swipe: "/media/clippy/black_swipe_8fps.gif",
        walk: "/media/clippy/black_walk_8fps.gif",
        walk_fast: "/media/clippy/black_walk_fast_8fps.gif",
        with_ball: "/media/clippy/black_with_ball_8fps.gif",
    },

    idleActions: [
        { name: "idle", baseDuration: 2500, extraDuration: 2000 },
        { name: "swipe", baseDuration: 1200, extraDuration: 800 },
    ],

    movementActions: [
        { name: "walk", speedMultiplier: 1.0 },
        { name: "walk_fast", speedMultiplier: 1.3 },
        { name: "run", speedMultiplier: 1.8 },
    ],
};

export default clippyBlack;
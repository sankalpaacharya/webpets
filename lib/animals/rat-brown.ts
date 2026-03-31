import type { GifAnimalConfig } from "../types";

const ratBrown: GifAnimalConfig = {
    name: "rat-brown",
    spriteSize: { w: 135, h: 95 },
    scale: 1.5,
    speed: 4.5,
    idleDist: 48,
    hoverAction: "with_ball",
    hoverDist: 50,
    idlePauseMs: { min: 1500, max: 2200 },
    followMouse: false,

    actions: {
        idle: "/media/rat/brown_idle_8fps.gif",
        run: "/media/rat/brown_run_8fps.gif",
        swipe: "/media/rat/brown_swipe_8fps.gif",
        walk: "/media/rat/brown_walk_8fps.gif",
        walk_fast: "/media/rat/brown_walk_fast_8fps.gif",
        with_ball: "/media/rat/brown_with_ball_8fps.gif",
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

export default ratBrown;
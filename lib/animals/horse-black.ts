import type { GifAnimalConfig } from "../types";

const horseBlack: GifAnimalConfig = {
    name: "horse-black",
    spriteSize: { w: 80, h: 64 },
    scale: 1.5,
    speed: 4.5,
    idleDist: 48,
    hoverAction: "with_ball",
    hoverDist: 50,
    idlePauseMs: { min: 1500, max: 2200 },
    followMouse: false,

    actions: {
        idle: "/media/horse/black_idle_8fps.gif",
        run: "/media/horse/black_run_8fps.gif",
        stand: "/media/horse/black_stand_8fps.gif",
        swipe: "/media/horse/black_swipe_8fps.gif",
        walk: "/media/horse/black_walk_8fps.gif",
        walk_fast: "/media/horse/black_walk_fast_8fps.gif",
        with_ball: "/media/horse/black_with_ball_8fps.gif",
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

export default horseBlack;
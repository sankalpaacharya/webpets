import type { GifAnimalConfig } from "../types";

const rockyGray: GifAnimalConfig = {
    name: "rocky-gray",
    spriteSize: { w: 160, h: 120 },
    scale: 1.5,
    speed: 4.5,
    idleDist: 48,
    hoverAction: "swipe",
    hoverDist: 50,
    idlePauseMs: { min: 1500, max: 2200 },
    followMouse: false,

    actions: {
        idle: "/media/rocky/gray_idle_8fps.gif",
        run: "/media/rocky/gray_run_8fps.gif",
        swipe: "/media/rocky/gray_swipe_8fps.gif",
        walk: "/media/rocky/gray_walk_8fps.gif",
        walk_fast: "/media/rocky/gray_walk_fast_8fps.gif",
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

export default rockyGray;
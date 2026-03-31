import type { GifAnimalConfig } from "../types";

const skeletonBlue: GifAnimalConfig = {
    name: "skeleton-blue",
    spriteSize: { w: 68, h: 64 },
    scale: 1.5,
    speed: 4.5,
    idleDist: 48,
    hoverAction: "with_ball",
    hoverDist: 50,
    idlePauseMs: { min: 1500, max: 2200 },
    followMouse: false,

    actions: {
        idle: "/media/skeleton/blue_idle_8fps.gif",
        run: "/media/skeleton/blue_run_8fps.gif",
        stand: "/media/skeleton/blue_stand_8fps.gif",
        swipe: "/media/skeleton/blue_swipe_8fps.gif",
        walk: "/media/skeleton/blue_walk_8fps.gif",
        with_ball: "/media/skeleton/blue_with_ball_8fps.gif",
    },

    idleActions: [
        { name: "idle", baseDuration: 2500, extraDuration: 2000 },
        { name: "swipe", baseDuration: 1200, extraDuration: 800 },
    ],

    movementActions: [
        { name: "walk", speedMultiplier: 1.0 },
        { name: "run", speedMultiplier: 1.8 },
    ],
};

export default skeletonBlue;
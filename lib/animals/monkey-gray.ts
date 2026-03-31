import type { GifAnimalConfig } from "../types";

const monkeyGray: GifAnimalConfig = {
    name: "monkey-gray",
    spriteSize: { w: 150, h: 150 },
    scale: 1.5,
    speed: 4.5,
    idleDist: 48,
    hoverAction: "with_ball",
    hoverDist: 50,
    idlePauseMs: { min: 1500, max: 2200 },
    followMouse: false,

    actions: {
        idle: "/media/monkey/gray_idle_8fps.gif",
        run: "/media/monkey/gray_run_8fps.gif",
        swipe: "/media/monkey/gray_swipe_8fps.gif",
        walk: "/media/monkey/gray_walk_8fps.gif",
        with_ball: "/media/monkey/gray_with_ball_8fps.gif",
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

export default monkeyGray;
import type { GifAnimalConfig } from "../types";

const pandaBlack: GifAnimalConfig = {
    name: "panda-black",
    spriteSize: { w: 96, h: 96 },
    scale: 1.5,
    speed: 4.5,
    idleDist: 48,
    hoverAction: "with_ball",
    hoverDist: 50,
    idlePauseMs: { min: 1500, max: 2200 },
    followMouse: false,

    actions: {
        idle: "/media/panda/black_idle_8fps.gif",
        lie: "/media/panda/black_lie_8fps.gif",
        run: "/media/panda/black_run_8fps.gif",
        swipe: "/media/panda/black_swipe_8fps.gif",
        walk: "/media/panda/black_walk_8fps.gif",
        walk_fast: "/media/panda/black_walk_fast_8fps.gif",
        with_ball: "/media/panda/black_with_ball_8fps.gif",
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

export default pandaBlack;
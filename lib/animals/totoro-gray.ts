import type { GifAnimalConfig } from "../types";

const totoroGray: GifAnimalConfig = {
    name: "totoro-gray",
    spriteSize: { w: 250, h: 250 },
    scale: 1.5,
    speed: 4.5,
    idleDist: 48,
    hoverAction: "with_ball",
    hoverDist: 50,
    idlePauseMs: { min: 1500, max: 2200 },
    followMouse: false,

    actions: {
        fall_from_grab: "/media/totoro/gray_fall_from_grab_8fps.gif",
        idle: "/media/totoro/gray_idle_8fps.gif",
        jump: "/media/totoro/gray_jump_8fps.gif",
        land: "/media/totoro/gray_land_8fps.gif",
        lie: "/media/totoro/gray_lie_8fps.gif",
        run: "/media/totoro/gray_run_8fps.gif",
        swipe: "/media/totoro/gray_swipe_8fps.gif",
        walk: "/media/totoro/gray_walk_8fps.gif",
        wallclimb: "/media/totoro/gray_wallclimb_8fps.gif",
        wallgrab: "/media/totoro/gray_wallgrab_8fps.gif",
        with_ball: "/media/totoro/gray_with_ball_8fps.gif",
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

export default totoroGray;
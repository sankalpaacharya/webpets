import type { AnimalConfig } from "../types";

const bear: AnimalConfig = {
    name: "bear",
    spriteUrl: "/animals/bear.png",
    spriteSize: { w: 26, h: 20 },
    scale: 2.5,
    speed: 1,
    idleDist: 48,
    hoverAction: "attack",
    hoverDist: 50,
    frameMs: 125,
    movementFrameMs: 125,
    hoverFrameMs: 125,
    idleActionFrameMs: 125,
    idleCooldownPadding: 500,
    idlePauseMs: { min: 4000, max: 5000 },
    followMouse: false,

    sprites: {
        idle: [[-4, -17]],
        run: [
            [-4, -45],
            [-34, -46],
            [-65, -46],
            [-98, -49],
            [-132, -48],
            [-162, -46],
        ],
        motion: [
            [-5, -17],
            [-37, -17],
            [-70, -17],
            [-101, -17],
        ],
        attack: [
            [-66, -111],
            [-102, -111],
            [-133, -112],
        ],
        headdown: [
            [-5, -209],
            [-35, -210],
        ],
        bark: [
            [-70, -144],
            [-102, -144],
        ],
    },

    idleActions: [
        {
            name: "motion",
            baseDuration: 3000,
            extraDuration: 2200,
        },
        {
            name: "idle",
            baseDuration: 2800,
            extraDuration: 2000,
            staticFrame: true,
        },
        {
            name: "bark",
            baseDuration: 1400,
            extraDuration: 900,
        },
    ],

    movementActions: [
        {
            name: "run",
            speedMultiplier: 1.2,
        },
    ],
};

export default bear;

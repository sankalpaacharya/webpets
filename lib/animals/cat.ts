import type { AnimalConfig } from "../types";

const cat: AnimalConfig = {
  name: "cat",
  spriteUrl: "/animals/cat.png",
  spriteSize: { w: 56, h: 43 },
  scale: 1,
  speed: 1,
  idleDist: 48,
  hoverAction: "legStand",
  hoverDist: 50,
  frameMs: 125,
  movementFrameMs: 125,
  hoverFrameMs: 125,
  idleActionFrameMs: 200,
  idleCooldownPadding: 500,
  idlePauseMs: { min: 4000, max: 6000 },
  followMouse: false,

  sprites: {
    run: [
      [-8, -651],
      [-69, -649],
      [-133, -647],
      [-192, -647],
      [-265, -647],
    ],

    walk: [
      [-6, -330],
      [-76, -331],
      [-136, -328],
      [-195, -330],
      [-259, -327],
      [-326, -329],
    ],

    legStand: [
      [-14, -4172],
      [-78, -4169],
      [-143, -4169],
      [-208, -4170],
    ],

    licking: [
      [-16, -782],
      [-76, -782],
      [-139, -782],
      [-198, -782],
      [-264, -782],
      [-332, -782],
      [-396, -782],
      [-332, -782],
      [-264, -782],
      [-198, -782],
      [-139, -782],
      [-76, -782],
    ],

    jump: [
      [-8, -4110],   // crouch
      [-72, -4107],  // lift-off
      [-130, -4105], // peak
      [-199, -4107], // falling
      [-266, -4110], // landing
    ],

    scratching: [
      [-10, -1100],
      [-73, -1100],
      [-132, -1100],
      [-200, -1100],
      [-261, -1100],
      [-327, -1100],
      [-388, -1100],
      [-452, -1100],
      [-327, -1100],
      [-261, -1100],
      [-200, -1100],
      [-132, -1100],
      [-73, -1100],
    ],
  },

  idleActions: [
    {
      name: "legStand",
      baseDuration: 3000,
      extraDuration: 2000,
      staticFrame: true,
    },
    {
      name: "licking",
      baseDuration: 3000,
      extraDuration: 2000,
    },
    {
      name: "jump",
      baseDuration: 2500,
      extraDuration: 2000,
    },
    {
      name: "scratching",
      baseDuration: 3200,
      extraDuration: 2400,
    },
  ],

  movementActions: [
    {
      name: "walk",
      speedMultiplier: 0.7,
    },
    {
      name: "run",
      speedMultiplier: 1.0,
    },
  ],
};

export default cat;
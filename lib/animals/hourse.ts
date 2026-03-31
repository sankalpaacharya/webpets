import type { AnimalConfig } from "../types";

const horse: AnimalConfig = {
  name: "horse",

  spriteUrl: "/animals/horse.png",

  spriteSize: { w: 85, h: 70 },

  scale: 1,

  // 🧠 Movement feels more natural slightly slower
  speed: 0.8,

  idleDist: 48,

  hoverAction: "idle",
  hoverDist: 50,

  // 🧠 Better timing consistency
  frameMs: 125,
  movementFrameMs: 125,
  hoverFrameMs: 125,
  idleActionFrameMs: 125,

  idleCooldownPadding: 800,

  idlePauseMs: { min: 5000, max: 7000 },

  followMouse: false,

  sprites: {
    // 🧠 idle should be calm + centered frame
    idle: [[-146, -1319]],

    // 🧠 walk: smoother loop (4 frames OK but slower timing)
    walk: [
      [-27, -917],
      [-152, -919],
      [-280, -916],
      [-406, -919],
    ],

    // ⚠️ run only has 3 frames → needs faster cycling
    run: [
      [-19, -399],
      [-147, -406],
      [-408, -399],
    ],

    // 🧠 eating is good but should feel slower
    eating: [
      [-145, -1301],
      [-271, -1305],
      [-401, -1307],
    ],

    // 🧠 single frame = pause-type action
    looking: [[-153, -792]],
  },

  idleActions: [
    {
      name: "eating",
      baseDuration: 3500,
      extraDuration: 2500,
    },
  ],

  movementActions: [
    {
      name: "run",
      speedMultiplier: 1.4, // 🧠 make run clearly faster than walk
    },
    {
      name: "walk",
      speedMultiplier: 0.6,
    },
  ],
};

export default horse;
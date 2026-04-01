/** Sprite coordinate map: animation name → array of [x, y] background-position offsets */
export type SpriteSet = Record<string, [number, number][]>;

/** Describes one idle behaviour the pet can perform */
export type IdleAction = {
    /** Must match a key in the animal's SpriteSet */
    name: string;
    /** Base duration in ms */
    baseDuration: number;
    /** Random extra duration in ms added on top of baseDuration */
    extraDuration: number;
    /** If true, always show frame 0 (static pose). Otherwise cycles frames. */
    staticFrame?: boolean;
};

/** Describes one movement behaviour the pet can perform while walking */
export type MovementAction = {
    /** Must match a key in the animal's SpriteSet */
    name: string;
    /** Speed multiplier applied to the base speed */
    speedMultiplier: number;
};

/** Full configuration for one animal — this is the only thing you need to create to add a pet */
export type AnimalConfig = {
    name: string;
    /** Path to the sprite sheet, e.g. "/animals/bear.png" */
    spriteUrl: string;
    /** Pixel dimensions of a single sprite frame */
    spriteSize: { w: number; h: number };
    /** Render scale multiplier (optional) */
    scale?: number;
    /** Movement speed in px per animation frame */
    speed: number;
    /** Distance (px) at which the pet stops chasing and idles */
    idleDist: number;
    /** Sprite key to play when mouse is near (e.g. "attack", "hiss", "bark") */
    hoverAction: string;
    /** Distance (px) at which the hover action triggers */
    hoverDist: number;
    /** Milliseconds between walk-cycle frames */
    frameMs: number;
    /** Milliseconds between movement frames (walk/run) */
    movementFrameMs: number;
    /** Milliseconds between hover-action frames */
    hoverFrameMs: number;
    /** Milliseconds between idle-action frames */
    idleActionFrameMs: number;
    /** Cooldown padding (ms) after idle action ends before picking a new one */
    idleCooldownPadding: number;
    /** Random idle pause range (ms) between movement segments */
    idlePauseMs: { min: number; max: number };
    /** If true the pet chases the mouse cursor; if false it wanders autonomously */
    followMouse: boolean;
    /** Sprite coordinate sets keyed by animation name */
    sprites: SpriteSet;
    /** Idle behaviours the pet can randomly perform */
    idleActions: IdleAction[];
    /** Movement behaviours the pet can randomly perform while walking */
    movementActions: MovementAction[];
};

/** Describes one idle behaviour for GIF-based pets */
export type GifIdleAction = {
    /** Must match a key in the action map */
    name: string;
    /** Base duration in ms */
    baseDuration: number;
    /** Random extra duration in ms added on top of baseDuration */
    extraDuration: number;
};

/** Describes one movement behaviour for GIF-based pets */
export type GifMovementAction = {
    /** Must match a key in the action map */
    name: string;
    /** Speed multiplier applied to the base speed */
    speedMultiplier: number;
};


/** Configuration for a GIF-based pet */
export type GifAnimalConfig = {
    name: string;
    /** Folder name under /public/media */
    mediaFolder: string;
    /** Default color token used in GIF filenames */
    defaultColor: string;
    /** Optional allowed colors; defaults to [defaultColor] */
    colors?: string[];
    /** Pixel dimensions of the GIF frame */
    spriteSize: { w: number; h: number };
    /** Render scale multiplier (optional) */
    scale?: number;
    /** Movement speed in px per animation frame */
    speed: number;
    /** Distance (px) at which the pet stops chasing and idles */
    idleDist: number;
    /** Action key to play when mouse is near */
    hoverAction: string;
    /** Distance (px) at which the hover action triggers */
    hoverDist: number;
    /** Random idle pause range (ms) between movement segments */
    idlePauseMs: { min: number; max: number };
    /** If true the pet chases the mouse cursor; if false it wanders autonomously */
    followMouse: boolean;
    /** Available action keys for this pet */
    actions: string[];
    /** Idle behaviours the pet can randomly perform */
    idleActions: GifIdleAction[];
    /** Movement behaviours the pet can randomly perform while walking */
    movementActions: GifMovementAction[];
};

export type MediaAnimal = {
    name: string;
    logoUrl: string;
};

export type MediaAnimalVariant = {
    color: string;
    action: string;
    fps: number;
    gifUrl: string;
};

export type MediaAnimalWithVariants = MediaAnimal & {
    variants: MediaAnimalVariant[];
};

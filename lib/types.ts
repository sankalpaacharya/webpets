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

export type GeneratedAnimalVariant = {
    variant: string;
    action: string;
    fps: number;
    gifUrl: string;
    fileName: string;
};

export type GeneratedAnimalWithVariants = {
    name: string;
    logoUrl: string | null;
    variants: GeneratedAnimalVariant[];
};

export const REGISTRY_ITEM_URL =
  "https://webpets-flame.vercel.app/r/web-pet.json";

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;

export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

export const INSTALL_COMMANDS: Record<PackageManager, string> = {
  pnpm: `pnpm dlx shadcn@latest add ${REGISTRY_ITEM_URL}`,
  npm: `npx shadcn@latest add ${REGISTRY_ITEM_URL}`,
  yarn: `yarn dlx shadcn@latest add ${REGISTRY_ITEM_URL}`,
  bun: `bunx --bun shadcn@latest add ${REGISTRY_ITEM_URL}`,
};

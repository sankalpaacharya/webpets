export type DocLink = {
  title: string;
  href: string;
  description: string;
};

export type DocGroup = {
  label: string;
  items: DocLink[];
};

export const DOCS_NAV: DocGroup[] = [
  {
    label: "Getting Started",
    items: [
      {
        title: "Introduction",
        href: "/docs",
        description: "A pixel pet that walks along the bottom of your page.",
      },
      {
        title: "Installation",
        href: "/docs/installation",
        description: "Add the component and the GIFs it needs.",
      },
      {
        title: "Usage",
        href: "/docs/usage",
        description: "Render a pet and see it move.",
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        title: "Props",
        href: "/docs/props",
        description: "Every prop the component accepts.",
      },
      {
        title: "Behavior",
        href: "/docs/behavior",
        description: "How the pet decides what to do, and how to tune it.",
      },
    ],
  },
  {
    label: "Components",
    items: [
      {
        title: "Pet Picker",
        href: "/docs/pet-picker",
        description: "Let visitors click the pet and choose their own.",
      },
    ],
  },
  {
    label: "Guides",
    items: [
      {
        title: "Animals",
        href: "/docs/animals",
        description: "Every animal and color that ships with WebPet.",
      },
      {
        title: "Custom Animals",
        href: "/docs/custom-animals",
        description: "Bring your own sprites.",
      },
    ],
  },
];

export const DOCS_LINKS: DocLink[] = DOCS_NAV.flatMap((group) => group.items);

export function findDocLink(href: string): DocLink | undefined {
  return DOCS_LINKS.find((link) => link.href === href);
}

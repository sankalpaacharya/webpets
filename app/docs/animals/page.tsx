import Image from "next/image";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { PET_MANIFEST } from "@/lib/pet-manifest";

import { DocPage } from "../components/doc-page";
import { Note } from "../components/doc-primitives";

export const metadata: Metadata = { title: "Animals" };

const ANIMALS = Object.entries(PET_MANIFEST).sort(([a], [b]) => a.localeCompare(b));

export default function AnimalsPage() {
  return (
    <DocPage href="/docs/animals">
      <Note>
        {ANIMALS.length} animals. Pass the name as <code className="font-mono">animal</code>{" "}
        and one of its colors as <code className="font-mono">color</code>.
      </Note>
      <ul className="grid gap-3 sm:grid-cols-2">
        {ANIMALS.map(([name, entry]) => (
          <li
            key={name}
            className="flex items-start gap-3 rounded-lg border border-border p-3"
          >
            <Image
              src={`/media/${name}/icon.png`}
              alt=""
              width={32}
              height={32}
              unoptimized
              className="size-8 shrink-0 [image-rendering:pixelated]"
            />
            <div className="min-w-0 space-y-1.5">
              <p className="font-mono text-sm">{name}</p>
              <div className="flex flex-wrap gap-1">
                {entry.colors.map((color) => (
                  <Badge key={color} variant="outline" className="font-mono text-[11px]">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </DocPage>
  );
}

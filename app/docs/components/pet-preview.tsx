"use client";

import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebPet } from "@/components/web-pet";
import type { WebPetProps } from "@/components/web-pet";

type PetPreviewProps = {
  pet: WebPetProps;
  /** The snippet shown on the Code tab. */
  code: string;
};

export function PetPreview({ pet, code }: PetPreviewProps) {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="mt-3">
        <div
          className="relative h-64 overflow-hidden rounded-lg border border-border"
          style={{
            backgroundImage: "url('/media/background/house.png')",
            backgroundPosition: "center bottom",
            backgroundSize: "cover",
          }}
        >
          <WebPet {...pet} position="absolute" />
        </div>
      </TabsContent>
      <TabsContent value="code" className="mt-3">
        <CodeBlock code={code} lang="tsx" />
      </TabsContent>
    </Tabs>
  );
}

"use client";

import { CodeBlock } from "@/components/code-block";
import { PetPicker } from "@/components/pet-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CODE = `import { PetPicker } from "@/components/pet-picker";

<PetPicker defaultAnimal="deno" hoverMessage="click me" />`;

export function PickerPreview() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview" className="mt-3">
        <div
          className="relative isolate h-64 overflow-hidden rounded-lg border border-border"
          style={{
            backgroundImage: "url('/media/background/house.png')",
            backgroundPosition: "center bottom",
            backgroundSize: "cover",
          }}
        >
          <PetPicker
            defaultAnimal="deno"
            hoverMessage="click me"
            position="absolute"
            storageKey={null}
            popoverClassName="font-body"
          />
        </div>
      </TabsContent>
      <TabsContent value="code" className="mt-3">
        <CodeBlock code={CODE} lang="tsx" />
      </TabsContent>
    </Tabs>
  );
}

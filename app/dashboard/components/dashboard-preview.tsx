"use client";

import { useMemo } from "react";

import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebPet } from "@/components/web-pet";

type PreviewPanelProps = {
  animal: string;
  color: string;
  speed: number;
  scale: number;
  followMouse: boolean;
  hoverMessage: string;
};

function buildSnippet(props: PreviewPanelProps): string {
  const lines = [
    `animal="${props.animal || "fox"}"`,
    `color="${props.color}"`,
    `speed={${Number(props.speed.toFixed(2))}}`,
    `scale={${Number(props.scale.toFixed(2))}}`,
  ];
  if (props.followMouse) lines.push("followMouse");
  const message = props.hoverMessage.trim();
  if (message) lines.push(`hoverMessage="${message.replace(/"/g, '\\"')}"`);

  return `import { WebPet } from "@/components/web-pet";\n\n<WebPet\n  ${lines.join("\n  ")}\n/>`;
}

export function PreviewPanel(props: PreviewPanelProps) {
  const { animal, color, speed, scale, followMouse, hoverMessage } = props;
  const code = useMemo(() => buildSnippet(props), [props]);

  return (
    <Card className="gap-0 py-0">
      <Tabs defaultValue="preview">
        <CardHeader className="border-b border-border px-4 py-3">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent className="p-4">
          <TabsContent value="preview">
            <div
              className="relative isolate h-72 overflow-hidden rounded-md border border-border"
              style={{
                backgroundImage: "url('/media/background/house.png')",
                backgroundPosition: "center bottom",
                backgroundSize: "cover",
              }}
            >
              {animal ? (
                <WebPet
                  animal={animal}
                  color={color}
                  speed={speed}
                  scale={scale}
                  followMouse={followMouse}
                  hoverMessage={hoverMessage}
                  position="absolute"
                />
              ) : null}
            </div>
          </TabsContent>
          <TabsContent value="code">
            <CodeBlock code={code} lang="tsx" />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

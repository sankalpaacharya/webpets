"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Highlighter } from "shiki";

import { WebPet } from "@/components/web-pet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PreviewPanelProps = {
  animal: string;
  color: string;
  speed: number;
  scale: number;
  followMouse: boolean;
};

export function PreviewPanel({
  animal,
  color,
  speed,
  scale,
  followMouse,
}: PreviewPanelProps) {
  const code = useMemo(() => {
    const resolvedAnimal = animal || "fox";
    const props = [
      `animal="${resolvedAnimal}"`,
      `color="${color}"`,
      `speed={${Number(speed.toFixed(2))}}`,
      `scale={${Number(scale.toFixed(2))}}`,
    ];

    if (followMouse) {
      props.push("followMouse");
    }

    return `import { WebPet } from "@/components/web-pet";\n\n<WebPet\n  ${props.join(
      "\n  ",
    )}\n/>`;
  }, [animal, color, speed, scale, followMouse]);
  const highlighterRef = useRef<Highlighter | null>(null);
  const [codeHtml, setCodeHtml] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    let active = true;

    const renderCode = async () => {
      const { createHighlighter } = await import("shiki");
      if (!highlighterRef.current) {
        highlighterRef.current = await createHighlighter({
          themes: ["github-dark"],
          langs: ["tsx"],
        });
      }

      const html = highlighterRef.current.codeToHtml(code, {
        lang: "tsx",
        theme: "github-dark",
      });

      if (active) {
        setCodeHtml(html);
      }
    };

    renderCode();

    return () => {
      active = false;
    };
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("idle");
    }
  };

  return (
    <Card className="dashboard-enter relative h-105 overflow-hidden">
      <Tabs defaultValue="preview" className="flex h-full flex-col">
        <CardHeader className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="sr-only">Preview</CardTitle>
            <TabsList className="text-xs gap-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent className="relative flex h-full flex-col gap-4 pb-6 text-xs text-muted-foreground">
          <TabsContent value="preview" className="relative h-full">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/media/background/house.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center bottom",
                backgroundSize: "cover",
              }}
            />
            <div className="relative flex h-full items-end justify-center">
              {animal ? (
                <WebPet
                  animal={animal}
                  color={color}
                  speed={speed}
                  scale={scale}
                  followMouse={followMouse}
                  position="absolute"
                />
              ) : null}
            </div>
          </TabsContent>
          <TabsContent value="code" className="relative h-full">
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                className="px-4"
                onClick={handleCopy}
              >
                {copyState === "copied" ? "Copied" : "Copy"}
              </Button>
            </div>
            <div className="mt-4 h-[calc(100%-2.5rem)] overflow-auto rounded-2xl border border-border bg-card/60 p-3 text-xs font-mono [&_.shiki]:whitespace-pre-wrap [&_.shiki]:break-words [&_.shiki]:m-0 [&_.shiki>code]:whitespace-pre-wrap [&_.shiki>code]:break-words [&>pre]:whitespace-pre-wrap [&>pre]:break-words [&>pre]:m-0">
              {codeHtml ? (
                <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
              ) : (
                <pre>
                  <code>{code}</code>
                </pre>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

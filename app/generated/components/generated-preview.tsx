"use client";

import { useState } from "react";

import { Download01Icon, LinkSquare01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/button";
import type { GeneratedAnimalVariant } from "@/lib/types";

type GeneratedPreviewProps = {
  animal: string;
  variant: string;
  action: string;
  selectedGif: GeneratedAnimalVariant | null;
};

export function GeneratedPreview({
  animal,
  variant,
  action,
  selectedGif,
}: GeneratedPreviewProps) {
  const downloadLabel = selectedGif?.fileName ?? "generated.gif";
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const handleCopyUrl = async () => {
    if (!selectedGif) return;
    try {
      const url = new URL(
        selectedGif.gifUrl,
        window.location.origin,
      ).toString();
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("idle");
    }
  };

  return (
    <Card className="dashboard-enter relative h-105 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Generated GIF</CardTitle>
          {selectedGif ? (
            <div className="text-xs text-muted-foreground">
              {variant} / {action} / {selectedGif.fps}fps
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4 pb-6 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {selectedGif ? selectedGif.fileName : "Pick a variant + action."}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selectedGif ? (
              <Button
                variant="outline"
                size="sm"
                className="px-3"
                onClick={handleCopyUrl}
              >
                <HugeiconsIcon icon={LinkSquare01Icon} size={16} />
                {copyState === "copied" ? "Copied" : "Copy URL"}
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="px-3" disabled>
                <HugeiconsIcon icon={LinkSquare01Icon} size={16} />
                Copy URL
              </Button>
            )}
            {selectedGif ? (
              <Button asChild variant="outline" size="sm" className="px-3">
                <a href={selectedGif.gifUrl} download={downloadLabel}>
                  <HugeiconsIcon icon={Download01Icon} size={16} />
                  Download GIF
                </a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="px-3" disabled>
                <HugeiconsIcon icon={Download01Icon} size={16} />
                Download GIF
              </Button>
            )}
          </div>
        </div>
        <div className="flex h-full items-center justify-center rounded-2xl border border-border bg-card/60 p-6">
          {selectedGif ? (
            <img
              src={selectedGif.gifUrl}
              alt={`${animal} ${variant} ${action}`}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="text-xs text-muted-foreground">
              Select an animal to preview the GIF.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

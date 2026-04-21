"use client";

import { useState } from "react";

import { LinkSquare01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/button";
import type { GeneratedAnimalVariant } from "@/lib/types";

type ReadmePreviewProps = {
  animal: string;
  variant: string;
  action: string;
  selectedGif: GeneratedAnimalVariant | null;
  savedLabel: string;
  liveUrl: string;
  liveRefreshKey: number;
};

export function ReadmePreview({
  animal,
  variant,
  action,
  selectedGif,
  savedLabel,
  liveUrl,
  liveRefreshKey,
}: ReadmePreviewProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const handleCopyUrl = async () => {
    try {
      const url = new URL(liveUrl, window.location.origin).toString();
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1500);
    } catch {
      setCopyState("idle");
    }
  };

  const livePreviewUrl = `${liveUrl}?t=${liveRefreshKey}`;

  return (
    <Card className="dashboard-enter relative h-105 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>README GIF</CardTitle>
          <div className="text-xs text-muted-foreground">
            Saved: {savedLabel}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-4 pb-6 text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {selectedGif ? selectedGif.fileName : "Pick a variant + action."}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={handleCopyUrl}
            >
              <HugeiconsIcon icon={LinkSquare01Icon} size={16} />
              {copyState === "copied" ? "Copied" : "Copy API URL"}
            </Button>
            <Button asChild variant="outline" size="sm" className="px-3">
              <a href={liveUrl} target="_blank" rel="noreferrer">
                <HugeiconsIcon icon={LinkSquare01Icon} size={16} />
                Open API
              </a>
            </Button>
          </div>
        </div>
        <div className="grid h-full gap-4 md:grid-cols-2">
          <div className="flex h-full flex-col gap-2">
            <div className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              Selected
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
          </div>
          <div className="flex h-full flex-col gap-2">
            <div className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              Live /api
            </div>
            <div className="flex h-full items-center justify-center rounded-2xl border border-border bg-card/60 p-6">
              <img
                src={livePreviewUrl}
                alt="Live README GIF"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

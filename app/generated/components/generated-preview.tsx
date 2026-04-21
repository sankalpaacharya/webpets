"use client";

import { Download01Icon } from "@hugeicons/core-free-icons";
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

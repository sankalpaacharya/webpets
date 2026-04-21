"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/8bit/select";
import { Button } from "@/components/ui/button";

const saveLabels = {
  idle: "Save for README",
  saving: "Saving...",
  saved: "Saved",
  error: "Retry save",
} as const;

type ReadmeControlsProps = {
  variants: string[];
  actions: string[];
  selectedVariant: string;
  selectedAction: string;
  onVariantChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onSave: () => void;
  saveState: "idle" | "saving" | "saved" | "error";
  saveMessage: string;
  disabled?: boolean;
};

export function ReadmeControls({
  variants,
  actions,
  selectedVariant,
  selectedAction,
  onVariantChange,
  onActionChange,
  onSave,
  saveState,
  saveMessage,
  disabled = false,
}: ReadmeControlsProps) {
  return (
    <aside className="dashboard-enter space-y-5 text-sm text-muted-foreground">
      <Card>
        <CardHeader>
          <CardTitle>README config</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <label className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Variant</span>
            <Select value={selectedVariant} onValueChange={onVariantChange}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                {variants.map((variant) => (
                  <SelectItem key={variant} value={variant}>
                    {variant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs">{variants.length} available</span>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Action</span>
            <Select value={selectedAction} onValueChange={onActionChange}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                {actions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs">{actions.length} available</span>
          </label>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={onSave}
              disabled={disabled || saveState === "saving"}
            >
              {saveLabels[saveState]}
            </Button>
            {saveMessage ? (
              <span className="text-xs text-muted-foreground">
                {saveMessage}
              </span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

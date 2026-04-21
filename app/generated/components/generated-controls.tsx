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

type GeneratedControlsProps = {
  variants: string[];
  actions: string[];
  selectedVariant: string;
  selectedAction: string;
  onVariantChange: (value: string) => void;
  onActionChange: (value: string) => void;
};

export function GeneratedControls({
  variants,
  actions,
  selectedVariant,
  selectedAction,
  onVariantChange,
  onActionChange,
}: GeneratedControlsProps) {
  return (
    <aside className="dashboard-enter space-y-5 text-sm text-muted-foreground">
      <Card>
        <CardHeader>
          <CardTitle>Pick a GIF</CardTitle>
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
        </CardContent>
      </Card>
    </aside>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/8bit/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/8bit/select";
import { Slider } from "@/components/ui/8bit/slider";
import { Switch } from "@/components/ui/8bit/switch";

type ControlsPanelProps = {
  speed: number;
  scale: number;
  baseSpeed: number;
  selectedColor: string;
  availableColors: string[];
  followMouse: boolean;
  onSpeedChange: (value: number) => void;
  onScaleChange: (value: number) => void;
  onColorChange: (value: string) => void;
  onFollowMouseChange: (value: boolean) => void;
};

export function ControlsPanel({
  speed,
  scale,
  baseSpeed,
  selectedColor,
  availableColors,
  followMouse,
  onSpeedChange,
  onScaleChange,
  onColorChange,
  onFollowMouseChange,
}: ControlsPanelProps) {
  return (
    <aside className="dashboard-enter space-y-4 text-sm text-muted-foreground">
      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Speed</span>
            <Slider
              min={1}
              max={8}
              step={0.1}
              value={[speed]}
              onValueChange={(value) => onSpeedChange(value[0] ?? baseSpeed)}
            />
            <span className="text-xs">{speed.toFixed(1)} px/tick</span>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Scale</span>
            <Slider
              min={0.3}
              max={1.5}
              step={0.05}
              value={[scale]}
              onValueChange={(value) => onScaleChange(value[0] ?? 0.5)}
            />
            <span className="text-xs">{scale.toFixed(2)}x</span>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Color</span>
            <Select value={selectedColor} onValueChange={onColorChange}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {availableColors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2">
            <span className="font-medium text-foreground">Follow mouse</span>
            <Switch
              checked={followMouse}
              onCheckedChange={onFollowMouseChange}
              aria-label="Follow mouse"
            />
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

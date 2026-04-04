"use client";

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
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
  hoverMessage: string;
  onSpeedChange: (value: number) => void;
  onScaleChange: (value: number) => void;
  onColorChange: (value: string) => void;
  onFollowMouseChange: (value: boolean) => void;
  onHoverMessageChange: (value: string) => void;
};

export function ControlsPanel({
  speed,
  scale,
  baseSpeed,
  selectedColor,
  availableColors,
  followMouse,
  hoverMessage,
  onSpeedChange,
  onScaleChange,
  onColorChange,
  onFollowMouseChange,
  onHoverMessageChange,
}: ControlsPanelProps) {
  return (
    <aside className="dashboard-enter space-y-5 text-sm text-muted-foreground">
      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <label className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-medium text-foreground">
              <HugeiconsIcon icon={ArrowUp01Icon} size={16} />
              Speed
            </span>
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
            <span className="flex items-center gap-2 font-medium text-foreground">
              <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
              Scale
            </span>
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
            <span className="flex items-center gap-2 font-medium text-foreground">
              <HugeiconsIcon icon={UnfoldMoreIcon} size={16} />
              Color
            </span>
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
            <span className="flex items-center gap-2 font-medium text-foreground">
              <HugeiconsIcon icon={Tick02Icon} size={16} />
              Follow mouse
            </span>
            <Switch
              checked={followMouse}
              onCheckedChange={onFollowMouseChange}
              aria-label="Follow mouse"
            />
          </div>
          <label className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Hover text</span>
            <Input
              value={hoverMessage}
              onChange={(event) => onHoverMessageChange(event.target.value)}
              placeholder="Type a message..."
              maxLength={80}
              aria-label="Hover text"
            />
            <span className="text-xs">
              Optional. Shows only while hovering the pet.
            </span>
          </label>
        </CardContent>
      </Card>
    </aside>
  );
}

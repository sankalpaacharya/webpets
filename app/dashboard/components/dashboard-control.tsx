"use client";

import { useId } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

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

function Field({
  label,
  value,
  htmlFor,
  children,
}: {
  label: string;
  value?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        {value ? (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{value}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

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
  const id = useId();

  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Field label="Speed" value={`${speed.toFixed(1)} px/tick`}>
          <Slider
            min={1}
            max={8}
            step={0.1}
            value={[speed]}
            onValueChange={(value) => onSpeedChange(value[0] ?? baseSpeed)}
            aria-label="Speed"
          />
        </Field>

        <Field label="Scale" value={`${scale.toFixed(2)}×`}>
          <Slider
            min={0.3}
            max={1.5}
            step={0.05}
            value={[scale]}
            onValueChange={(value) => onScaleChange(value[0] ?? 0.5)}
            aria-label="Scale"
          />
        </Field>

        <Field label="Color" htmlFor={`${id}-color`}>
          <Select value={selectedColor} onValueChange={onColorChange}>
            <SelectTrigger id={`${id}-color`} className="w-full">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {availableColors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="flex items-center justify-between">
          <label htmlFor={`${id}-follow`} className="text-sm font-medium">
            Follow mouse
          </label>
          <Switch
            id={`${id}-follow`}
            checked={followMouse}
            onCheckedChange={onFollowMouseChange}
          />
        </div>

        <Field label="Hover text" htmlFor={`${id}-message`}>
          <Input
            id={`${id}-message`}
            value={hoverMessage}
            onChange={(event) => onHoverMessageChange(event.target.value)}
            placeholder="Say something…"
            maxLength={80}
          />
        </Field>
      </CardContent>
    </Card>
  );
}

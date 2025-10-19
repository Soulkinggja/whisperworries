import { useState } from "react";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker = ({ value, onChange, className }: ColorPickerProps) => {
  const [hue, setHue] = useState(270);
  const [saturation, setSaturation] = useState(65);
  const [lightness, setLightness] = useState(65);

  const handleColorChange = (h: number, s: number, l: number) => {
    setHue(h);
    setSaturation(s);
    setLightness(l);
    onChange(`hsl(${h}, ${s}%, ${l}%)`);
  };

  const colorWheelColors = [
    { hue: 0, label: "Red" },
    { hue: 30, label: "Orange" },
    { hue: 60, label: "Yellow" },
    { hue: 120, label: "Green" },
    { hue: 180, label: "Cyan" },
    { hue: 210, label: "Blue" },
    { hue: 270, label: "Purple" },
    { hue: 300, label: "Magenta" },
    { hue: 330, label: "Pink" },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Color Wheel */}
      <div className="grid grid-cols-9 gap-2">
        {colorWheelColors.map((color) => (
          <button
            key={color.hue}
            type="button"
            onClick={() => handleColorChange(color.hue, saturation, lightness)}
            className={cn(
              "w-10 h-10 rounded-full border-2 transition-all hover:scale-110 hover:shadow-lg",
              hue === color.hue ? "border-foreground scale-110" : "border-transparent"
            )}
            style={{ backgroundColor: `hsl(${color.hue}, ${saturation}%, ${lightness}%)` }}
            aria-label={color.label}
          />
        ))}
      </div>

      {/* Saturation Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Saturation</label>
        <input
          type="range"
          min="30"
          max="100"
          value={saturation}
          onChange={(e) => handleColorChange(hue, parseInt(e.target.value), lightness)}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, hsl(${hue}, 30%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`,
          }}
        />
      </div>

      {/* Lightness Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Brightness</label>
        <input
          type="range"
          min="40"
          max="80"
          value={lightness}
          onChange={(e) => handleColorChange(hue, saturation, parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 40%), hsl(${hue}, ${saturation}%, 80%))`,
          }}
        />
      </div>

      {/* Preview */}
      <div className="flex items-center gap-3">
        <div
          className="w-16 h-16 rounded-full border-2 border-border"
          style={{ backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)` }}
        />
        <div className="text-sm text-muted-foreground">
          {`hsl(${hue}, ${saturation}%, ${lightness}%)`}
        </div>
      </div>
    </div>
  );
};

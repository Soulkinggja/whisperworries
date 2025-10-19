import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

interface ColorTheme {
  name: string;
  icon: string;
  baseHue: number;
  saturation: number;
  lightness: number;
  gradient: string;
}

export const ColorPicker = ({ value, onChange, className }: ColorPickerProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("Lavender Dream");
  const [intensity, setIntensity] = useState(50);

  const colorThemes: ColorTheme[] = [
    {
      name: "Lavender Dream",
      icon: "💜",
      baseHue: 270,
      saturation: 65,
      lightness: 65,
      gradient: "from-purple-400 to-pink-400"
    },
    {
      name: "Ocean Breeze",
      icon: "🌊",
      baseHue: 200,
      saturation: 70,
      lightness: 60,
      gradient: "from-blue-400 to-cyan-400"
    },
    {
      name: "Sunset Glow",
      icon: "🌅",
      baseHue: 20,
      saturation: 80,
      lightness: 60,
      gradient: "from-orange-400 to-pink-400"
    },
    {
      name: "Forest Whisper",
      icon: "🌲",
      baseHue: 140,
      saturation: 60,
      lightness: 55,
      gradient: "from-green-400 to-emerald-500"
    },
    {
      name: "Candy Pop",
      icon: "🍭",
      baseHue: 330,
      saturation: 75,
      lightness: 65,
      gradient: "from-pink-400 to-rose-400"
    },
    {
      name: "Golden Hour",
      icon: "✨",
      baseHue: 45,
      saturation: 70,
      lightness: 60,
      gradient: "from-yellow-400 to-amber-400"
    },
    {
      name: "Midnight Sky",
      icon: "🌙",
      baseHue: 230,
      saturation: 55,
      lightness: 50,
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      name: "Cherry Blossom",
      icon: "🌸",
      baseHue: 340,
      saturation: 60,
      lightness: 70,
      gradient: "from-pink-300 to-rose-300"
    },
    {
      name: "Mint Fresh",
      icon: "🍃",
      baseHue: 160,
      saturation: 65,
      lightness: 65,
      gradient: "from-teal-400 to-cyan-400"
    },
    {
      name: "Electric Violet",
      icon: "⚡",
      baseHue: 280,
      saturation: 80,
      lightness: 60,
      gradient: "from-violet-400 to-purple-500"
    },
    {
      name: "Peachy Keen",
      icon: "🍑",
      baseHue: 25,
      saturation: 75,
      lightness: 68,
      gradient: "from-orange-300 to-pink-300"
    },
    {
      name: "Azure Dream",
      icon: "💎",
      baseHue: 210,
      saturation: 70,
      lightness: 65,
      gradient: "from-sky-400 to-blue-400"
    }
  ];

  const handleThemeSelect = (theme: ColorTheme) => {
    setSelectedTheme(theme.name);
    applyColor(theme, intensity);
  };

  const handleIntensityChange = (value: number) => {
    setIntensity(value);
    const theme = colorThemes.find(t => t.name === selectedTheme);
    if (theme) {
      applyColor(theme, value);
    }
  };

  const applyColor = (theme: ColorTheme, intensityValue: number) => {
    // Adjust lightness based on intensity (40-80 range)
    const adjustedLightness = 40 + (intensityValue / 100) * 40;
    // Adjust saturation slightly based on intensity
    const adjustedSaturation = theme.saturation - 10 + (intensityValue / 100) * 20;
    
    onChange(`hsl(${theme.baseHue}, ${adjustedSaturation}%, ${adjustedLightness}%)`);
  };

  const currentTheme = colorThemes.find(t => t.name === selectedTheme) || colorThemes[0];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>Choose Your Vibe</span>
      </div>

      {/* Color Themes Grid */}
      <div className="grid grid-cols-3 gap-3">
        {colorThemes.map((theme) => (
          <button
            key={theme.name}
            type="button"
            onClick={() => handleThemeSelect(theme)}
            className={cn(
              "group relative p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg",
              selectedTheme === theme.name 
                ? "border-primary shadow-md scale-105" 
                : "border-border/50 hover:border-primary/50"
            )}
          >
            {/* Gradient Background */}
            <div className={cn(
              "absolute inset-0 rounded-xl opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br",
              theme.gradient
            )} />
            
            {/* Content */}
            <div className="relative flex flex-col items-center gap-2">
              <div 
                className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg transition-transform group-hover:scale-110"
                style={{ 
                  backgroundColor: `hsl(${theme.baseHue}, ${theme.saturation}%, ${theme.lightness}%)`,
                  boxShadow: selectedTheme === theme.name 
                    ? `0 0 20px hsl(${theme.baseHue}, ${theme.saturation}%, ${theme.lightness}%, 0.5)` 
                    : 'none'
                }}
              />
              <div className="text-center">
                <div className="text-xl mb-1">{theme.icon}</div>
                <div className="text-xs font-medium line-clamp-2 leading-tight">
                  {theme.name}
                </div>
              </div>
            </div>

            {/* Selection Indicator */}
            {selectedTheme === theme.name && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center animate-scale-in">
                <Sparkles className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Intensity Slider */}
      <div className="space-y-3 p-4 rounded-xl bg-accent/50 border border-border/50">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Color Intensity</label>
          <span className="text-xs text-muted-foreground">{intensity}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={intensity}
            onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, 
                hsl(${currentTheme.baseHue}, ${currentTheme.saturation - 10}%, 40%), 
                hsl(${currentTheme.baseHue}, ${currentTheme.saturation}%, 60%),
                hsl(${currentTheme.baseHue}, ${currentTheme.saturation + 10}%, 80%))`,
            }}
          />
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-accent/30 border border-border/50">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full border-4 border-white/20 shadow-2xl transition-all duration-300 animate-pulse-glow"
            style={{ 
              backgroundColor: `hsl(${currentTheme.baseHue}, ${currentTheme.saturation - 10 + (intensity / 100) * 20}%, ${40 + (intensity / 100) * 40}%)`,
              boxShadow: `0 0 30px hsl(${currentTheme.baseHue}, ${currentTheme.saturation}%, ${60}%, 0.4)`
            }}
          />
          <div className="absolute -top-1 -right-1 text-2xl animate-bounce">
            {currentTheme.icon}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold mb-1">{currentTheme.name}</div>
          <div className="text-xs text-muted-foreground">
            Perfect for your unique style!
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const CharacterCustomization = () => {
  const [selectedColor, setSelectedColor] = useState("hsl(210, 100%, 50%)");
  const [selectedShape, setSelectedShape] = useState("square");

  const colors = [
    { name: "Blue", value: "hsl(210, 100%, 50%)" },
    { name: "Purple", value: "hsl(280, 80%, 60%)" },
    { name: "Pink", value: "hsl(330, 80%, 60%)" },
    { name: "Orange", value: "hsl(30, 90%, 55%)" },
    { name: "Green", value: "hsl(150, 60%, 50%)" },
  ];

  const shapes = ["square", "rounded", "circle"];

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your <span className="gradient-text">Block Character</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Customize your companion to reflect your unique personality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Preview */}
          <div className="bg-card rounded-3xl p-12 shadow-[var(--shadow-soft)] flex items-center justify-center min-h-[400px]">
            <div className="relative flex flex-col items-center gap-1">
              {/* Head */}
              <div
                className="w-24 h-24 transition-all duration-300"
                style={{
                  backgroundColor: selectedColor,
                  borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "12px" : "50%",
                }}
              />
              
              {/* Body */}
              <div
                className="w-28 h-32 transition-all duration-300"
                style={{
                  backgroundColor: selectedColor,
                  borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "12px" : "50%",
                  opacity: 0.9,
                }}
              />
              
              {/* Arms */}
              <div className="absolute top-[92px] flex gap-[72px]">
                <div
                  className="w-12 h-28 transition-all duration-300"
                  style={{
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "8px" : "50%",
                    opacity: 0.85,
                  }}
                />
                <div
                  className="w-12 h-28 transition-all duration-300"
                  style={{
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "8px" : "50%",
                    opacity: 0.85,
                  }}
                />
              </div>
              
              {/* Legs */}
              <div className="flex gap-2">
                <div
                  className="w-12 h-32 transition-all duration-300"
                  style={{
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "10px" : "50%",
                    opacity: 0.85,
                  }}
                />
                <div
                  className="w-12 h-32 transition-all duration-300"
                  style={{
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? "10px" : "50%",
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-8">
            {/* Colors */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Color</h3>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-16 h-16 rounded-xl transition-all hover:scale-110 ${
                      selectedColor === color.value ? "ring-4 ring-primary ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Shapes */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Shape</h3>
              <div className="flex gap-3">
                {shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setSelectedShape(shape)}
                    className={`px-6 py-3 rounded-xl border-2 transition-all hover:scale-105 capitalize ${
                      selectedShape === shape
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card"
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="magical" size="lg" className="w-full text-lg">
              <Sparkles className="w-5 h-5" />
              Save Character
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization;

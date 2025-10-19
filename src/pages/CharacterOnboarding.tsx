import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { Card } from "@/components/ui/card";

interface CharacterOnboardingProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedShape: string;
  setSelectedShape: (shape: string) => void;
  selectedFace: string;
  setSelectedFace: (face: string) => void;
  selectedGender: "male" | "female";
  setSelectedGender: (gender: "male" | "female") => void;
  characterName: string;
  setCharacterName: (name: string) => void;
  onSave: () => void;
}

export const CharacterOnboarding = ({
  selectedColor,
  setSelectedColor,
  selectedShape,
  setSelectedShape,
  selectedFace,
  setSelectedFace,
  selectedGender,
  setSelectedGender,
  characterName,
  setCharacterName,
  onSave,
}: CharacterOnboardingProps) => {
  const shapes = ["circle", "rounded", "square"];
  
  const faces = [
    { name: "Happy", emoji: "😊", value: "happy" },
    { name: "Calm", emoji: "😌", value: "calm" },
    { name: "Cheerful", emoji: "😄", value: "cheerful" },
    { name: "Excited", emoji: "🤩", value: "excited" },
    { name: "Thoughtful", emoji: "🤔", value: "thoughtful" },
    { name: "Sad", emoji: "😢", value: "sad" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Create Your Companion
          </h1>
          <p className="text-muted-foreground">
            Customize your personal wellness companion
          </p>
        </div>

        <div className="space-y-6">
          {/* Gender Selection */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={selectedGender === "male" ? "default" : "outline"}
                className="h-20 text-lg"
                onClick={() => setSelectedGender("male")}
              >
                <span className="text-3xl mr-2">♂</span>
                Male
              </Button>
              <Button
                type="button"
                variant={selectedGender === "female" ? "default" : "outline"}
                className="h-20 text-lg"
                onClick={() => setSelectedGender("female")}
              >
                <span className="text-3xl mr-2">♀</span>
                Female
              </Button>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Character Name</Label>
            <Input
              id="name"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Give your companion a name..."
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <ColorPicker color={selectedColor} onChange={setSelectedColor} />
          </div>

          {/* Shape Selection */}
          <div className="space-y-2">
            <Label>Shape Style</Label>
            <div className="grid grid-cols-3 gap-4">
              {shapes.map((shape) => (
                <Button
                  key={shape}
                  type="button"
                  variant={selectedShape === shape ? "default" : "outline"}
                  onClick={() => setSelectedShape(shape)}
                  className="capitalize"
                >
                  {shape}
                </Button>
              ))}
            </div>
          </div>

          {/* Face Selection */}
          <div className="space-y-2">
            <Label>Expression</Label>
            <div className="grid grid-cols-3 gap-3">
              {faces.map((face) => (
                <Button
                  key={face.value}
                  type="button"
                  variant={selectedFace === face.value ? "default" : "outline"}
                  onClick={() => setSelectedFace(face.value)}
                  className="h-16"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl">{face.emoji}</span>
                    <span className="text-xs">{face.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Character Preview */}
          <div className="flex justify-center py-6">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-20 h-20 transition-all duration-300"
                style={{
                  backgroundColor: selectedColor,
                  borderRadius:
                    selectedShape === "circle" ? "50%" :
                    selectedShape === "rounded" ? "12px" : "4px",
                }}
              />
              <div
                className="w-24 h-28 opacity-90"
                style={{
                  backgroundColor: selectedColor,
                  borderRadius:
                    selectedShape === "circle" ? "50%" :
                    selectedShape === "rounded" ? "12px" : "4px",
                }}
              />
            </div>
          </div>

          <Button onClick={onSave} className="w-full" size="lg">
            Create My Companion
          </Button>
        </div>
      </Card>
    </div>
  );
};

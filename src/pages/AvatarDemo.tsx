import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AvatarDemo = () => {
  const navigate = useNavigate();
  const [selectedGender, setSelectedGender] = useState<"male" | "female" | null>(null);

  const maleFeatures = {
    hair: "short",
    eyelashes: false,
    bodyWidth: 28,
    headSize: 24,
    color: "hsl(200, 70%, 60%)",
  };

  const femaleFeatures = {
    hair: "long",
    eyelashes: true,
    bodyWidth: 26,
    headSize: 22,
    color: "hsl(320, 65%, 65%)",
  };

  const AvatarPreview = ({ gender, color }: { gender: "male" | "female"; color: string }) => {
    const features = gender === "male" ? maleFeatures : femaleFeatures;

    return (
      <div className="relative flex flex-col items-center gap-1">
        {/* Hair (on top for female) */}
        {gender === "female" && (
          <div
            className="w-32 h-20 absolute -top-6 rounded-t-full"
            style={{
              backgroundColor: color,
              opacity: 0.9,
            }}
          />
        )}

        {/* Head */}
        <div
          className="relative flex items-center justify-center rounded-full z-10"
          style={{
            width: `${features.headSize * 4}px`,
            height: `${features.headSize * 4}px`,
            backgroundColor: color,
            boxShadow: `0 0 20px ${color}60`,
          }}
        >
          {/* Face */}
          <div className="flex flex-col items-center gap-2">
            {/* Eyes with optional eyelashes */}
            <div className="flex gap-3">
              {[0, 1].map((i) => (
                <div key={i} className="relative">
                  <div className="w-3 h-3 bg-foreground rounded-full" />
                  {features.eyelashes && (
                    <div className="absolute -top-1 left-0 w-3 flex gap-[2px]">
                      <div className="w-[2px] h-2 bg-foreground rounded-full rotate-[-20deg]" />
                      <div className="w-[2px] h-2 bg-foreground rounded-full" />
                      <div className="w-[2px] h-2 bg-foreground rounded-full rotate-[20deg]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Mouth */}
            <div
              className="w-8 h-2 bg-foreground"
              style={{
                borderRadius: "0 0 100px 100px",
              }}
            />
          </div>
        </div>

        {/* Hair (short on top for male) */}
        {gender === "male" && (
          <div
            className="absolute top-0 w-24 h-12 rounded-t-full"
            style={{
              backgroundColor: color,
              opacity: 0.85,
            }}
          />
        )}

        {/* Body */}
        <div
          className="rounded-full opacity-90"
          style={{
            width: `${features.bodyWidth * 4}px`,
            height: "128px",
            backgroundColor: color,
            boxShadow: `0 4px 20px ${color}60`,
          }}
        />

        {/* Arms */}
        <div className="absolute top-[100px] flex" style={{ gap: `${features.bodyWidth * 4.3}px` }}>
          <div
            className="w-12 h-28 rounded-full opacity-85"
            style={{
              backgroundColor: color,
              boxShadow: `0 2px 12px ${color}40`,
            }}
          />
          <div
            className="w-12 h-28 rounded-full opacity-85"
            style={{
              backgroundColor: color,
              boxShadow: `0 2px 12px ${color}40`,
            }}
          />
        </div>

        {/* Legs */}
        <div className="flex gap-2">
          <div
            className="w-12 h-32 rounded-full opacity-85"
            style={{
              backgroundColor: color,
              boxShadow: `0 2px 12px ${color}40`,
            }}
          />
          <div
            className="w-12 h-32 rounded-full opacity-85"
            style={{
              backgroundColor: color,
              boxShadow: `0 2px 12px ${color}40`,
            }}
          />
        </div>

        {/* Optional bow for female */}
        {gender === "female" && (
          <div className="absolute top-2 right-8">
            <div className="flex gap-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "hsl(340, 80%, 70%)" }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "hsl(340, 80%, 70%)" }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="container mx-auto max-w-6xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Avatar <span className="gradient-text">Style Options</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            See how male and female avatars look different
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Male Avatar */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedGender === "male" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedGender("male")}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-center">Male Avatar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 min-h-[500px] justify-center">
              <AvatarPreview gender="male" color={maleFeatures.color} />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Features:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Short hair style</li>
                  <li>• Slightly larger head & body</li>
                  <li>• Simple eye design</li>
                  <li>• Bolder proportions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Female Avatar */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedGender === "female" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedGender("female")}
          >
            <CardHeader>
              <CardTitle className="text-2xl text-center">Female Avatar</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 min-h-[500px] justify-center">
              <AvatarPreview gender="female" color={femaleFeatures.color} />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Features:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Long flowing hair</li>
                  <li>• Eyelashes for detail</li>
                  <li>• Optional bow accessory</li>
                  <li>• Softer proportions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison */}
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Key Differences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-3xl mb-2">💇</div>
                <h3 className="font-semibold mb-2">Hair Style</h3>
                <p className="text-sm text-muted-foreground">
                  Short & simple for male, long & flowing for female
                </p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-3xl mb-2">👁️</div>
                <h3 className="font-semibold mb-2">Eyes</h3>
                <p className="text-sm text-muted-foreground">
                  Female avatars have decorative eyelashes
                </p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg">
                <div className="text-3xl mb-2">🎀</div>
                <h3 className="font-semibold mb-2">Accessories</h3>
                <p className="text-sm text-muted-foreground">
                  Optional bow and decorative elements for female
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Note: All colors and expressions are available for both styles!
          </p>
          <Button size="lg" variant="magical" onClick={() => navigate("/customize")}>
            Create Your Avatar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AvatarDemo;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wind, Play, Pause, RotateCcw } from "lucide-react";

const Breathing = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("ready");
  const [count, setCount] = useState(4);
  const [pattern, setPattern] = useState("4-7-8");

  const patterns = {
    "4-7-8": { inhale: 4, hold: 7, exhale: 8, name: "Relaxing 4-7-8" },
    "box": { inhale: 4, hold: 4, exhale: 4, hold2: 4, name: "Box Breathing" },
    "calm": { inhale: 4, hold: 4, exhale: 6, name: "Calm Breathing" },
  };

  useEffect(() => {
    if (!isActive) return;

    const currentPattern = patterns[pattern as keyof typeof patterns];
    let timer: NodeJS.Timeout;

    if (phase === "inhale") {
      if (count > 0) {
        timer = setTimeout(() => setCount(count - 1), 1000);
      } else {
        setPhase("hold");
        setCount(currentPattern.hold);
      }
    } else if (phase === "hold") {
      if (count > 0) {
        timer = setTimeout(() => setCount(count - 1), 1000);
      } else {
        if (pattern === "box" && !("hold2" in currentPattern)) {
          setPhase("exhale");
          setCount(currentPattern.exhale);
        } else {
          setPhase("exhale");
          setCount(currentPattern.exhale);
        }
      }
    } else if (phase === "exhale") {
      if (count > 0) {
        timer = setTimeout(() => setCount(count - 1), 1000);
      } else {
        if (pattern === "box") {
          setPhase("hold2");
          setCount(4);
        } else {
          setPhase("inhale");
          setCount(currentPattern.inhale);
        }
      }
    } else if (phase === "hold2") {
      if (count > 0) {
        timer = setTimeout(() => setCount(count - 1), 1000);
      } else {
        setPhase("inhale");
        setCount(currentPattern.inhale);
      }
    }

    return () => clearTimeout(timer);
  }, [isActive, phase, count, pattern]);

  const handleStart = () => {
    setIsActive(true);
    setPhase("inhale");
    setCount(patterns[pattern as keyof typeof patterns].inhale);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase("ready");
    setCount(4);
  };

  const getPhaseText = () => {
    if (phase === "ready") return "Ready to begin";
    if (phase === "inhale") return "Breathe In";
    if (phase === "hold" || phase === "hold2") return "Hold";
    if (phase === "exhale") return "Breathe Out";
    return "";
  };

  const getCircleScale = () => {
    if (phase === "inhale") return "scale-150";
    if (phase === "hold" || phase === "hold2") return "scale-150";
    return "scale-100";
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Guided Breathing</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Pattern Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-accent" />
                Choose Your Pattern
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(patterns).map(([key, value]) => (
                  <Button
                    key={key}
                    variant={pattern === key ? "default" : "outline"}
                    onClick={() => {
                      setPattern(key);
                      handleReset();
                    }}
                    disabled={isActive}
                  >
                    {value.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Breathing Circle */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-8">
                {/* Animated Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div
                    className={`absolute w-full h-full rounded-full bg-gradient-weave transition-all duration-[4000ms] ease-in-out ${getCircleScale()}`}
                    style={{ opacity: 0.3 }}
                  />
                  <div className="absolute w-48 h-48 rounded-full bg-card flex items-center justify-center flex-col gap-2">
                    <div className="text-6xl font-bold text-primary">{count}</div>
                    <div className="text-lg text-muted-foreground">{getPhaseText()}</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                  {!isActive ? (
                    <Button
                      variant="magical"
                      size="lg"
                      onClick={handleStart}
                    >
                      <Play className="w-5 h-5" />
                      Start
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handlePause}
                    >
                      <Pause className="w-5 h-5" />
                      Pause
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </Button>
                </div>

                <p className="text-sm text-center text-muted-foreground max-w-md">
                  Follow the circle and count. Breathe deeply and let your worries float away.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Breathing;

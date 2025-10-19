import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";

interface Exercise {
  name: string;
  description: string;
  pattern: number[];
  labels: string[];
}

const exercises: Exercise[] = [
  {
    name: "4-7-8 Breathing",
    description: "Promotes relaxation and better sleep",
    pattern: [4, 7, 8],
    labels: ["Breathe In", "Hold", "Breathe Out"],
  },
  {
    name: "Box Breathing",
    description: "Reduces stress and improves focus",
    pattern: [4, 4, 4, 4],
    labels: ["Breathe In", "Hold", "Breathe Out", "Hold"],
  },
  {
    name: "Calm Breathing",
    description: "Simple technique for quick relaxation",
    pattern: [4, 6],
    labels: ["Breathe In", "Breathe Out"],
  },
];

const BreathingExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && selectedExercise) {
      const currentDuration = selectedExercise.pattern[currentPhase];
      
      interval = setInterval(() => {
        setSeconds((s) => {
          if (s >= currentDuration - 1) {
            setCurrentPhase((phase) => 
              (phase + 1) % selectedExercise.pattern.length
            );
            return 0;
          }
          return s + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentPhase, selectedExercise]);

  const handleStart = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase(0);
    setSeconds(0);
  };

  const getCircleScale = () => {
    if (!selectedExercise) return 1;
    const label = selectedExercise.labels[currentPhase];
    const duration = selectedExercise.pattern[currentPhase];
    const progress = seconds / duration;
    
    if (label.includes("In")) {
      return 1 + progress * 0.5;
    } else if (label.includes("Out")) {
      return 1.5 - progress * 0.5;
    }
    return 1.25;
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/customize")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {!selectedExercise ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 gradient-text">
                Breathing Exercises
              </h1>
              <p className="text-muted-foreground">
                Choose an exercise to begin your mindful breathing practice
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {exercises.map((exercise) => (
                <Card
                  key={exercise.name}
                  className="p-6 cursor-pointer hover:shadow-[var(--shadow-glow)] transition-all hover:-translate-y-1"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {exercise.description}
                  </p>
                  <div className="flex gap-1">
                    {exercise.pattern.map((num, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-8">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">{selectedExercise.name}</h2>
                <p className="text-muted-foreground">{selectedExercise.description}</p>
              </div>

              <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div
                    className="w-64 h-64 rounded-full bg-gradient-weave opacity-30 blur-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000"
                    style={{ transform: `translate(-50%, -50%) scale(${getCircleScale()})` }}
                  />
                  <div
                    className="w-64 h-64 rounded-full bg-gradient-sunset flex items-center justify-center transition-transform duration-1000"
                    style={{ transform: `scale(${getCircleScale()})` }}
                  >
                    <div className="text-center text-white">
                      <div className="text-6xl font-bold mb-2">
                        {selectedExercise.pattern[currentPhase] - seconds}
                      </div>
                      <div className="text-xl font-medium">
                        {selectedExercise.labels[currentPhase]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="min-w-[120px]"
                >
                  {isActive ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button onClick={handleReset} size="lg" variant="outline">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={() => {
                    setSelectedExercise(null);
                    handleReset();
                  }}
                  size="lg"
                  variant="ghost"
                >
                  Change Exercise
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BreathingExercises;

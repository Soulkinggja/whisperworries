import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";

const CheckIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mood, setMood] = useState([3]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const moodEmojis = ["😢", "😟", "😐", "🙂", "😄"];
  const moodLabels = ["Very Low", "Low", "Okay", "Good", "Great"];

  const handleSubmit = async () => {
    setLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      toast({
        title: "Check-in saved!",
        description: "Your mood has been recorded. Keep up the great work!",
      });
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Daily Check-In</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Heart className="w-6 h-6 text-primary" />
              How are you feeling today?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Mood Slider */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-float">{moodEmojis[mood[0] - 1]}</div>
                <p className="text-xl font-medium">{moodLabels[mood[0] - 1]}</p>
              </div>
              
              <Slider
                value={mood}
                onValueChange={setMood}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Very Low</span>
                <span>Great</span>
              </div>
            </div>

            {/* Optional Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Add a note (optional)
              </label>
              <Textarea
                placeholder="What's on your mind today? Any worries or wins to share?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              variant="magical"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Sparkles className="w-5 h-5" />
              {loading ? "Saving..." : "Save Check-In"}
            </Button>

            {/* Encouragement */}
            <p className="text-center text-sm text-muted-foreground">
              Taking time to check in with yourself is a sign of strength. 💜
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckIn;

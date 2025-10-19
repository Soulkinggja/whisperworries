import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

const DailyCheckIn = () => {
  const [mood, setMood] = useState([3]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"];
  const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Great"];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        title: `Daily Check-in - ${new Date().toLocaleDateString()}`,
        content: note,
        mood: moodLabels[mood[0] - 1],
      });

      if (error) throw error;

      toast({
        title: "✨ Check-in saved!",
        description: "Your daily mood has been recorded.",
      });

      navigate("/customize");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/customize")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-8 shadow-[var(--shadow-soft)]">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 gradient-text">
                Daily Check-In
              </h1>
              <p className="text-muted-foreground">
                How are you feeling today?
              </p>
            </div>

            {/* Mood Slider */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-float">
                  {moodEmojis[mood[0] - 1]}
                </div>
                <h3 className="text-2xl font-semibold text-primary">
                  {moodLabels[mood[0] - 1]}
                </h3>
              </div>

              <Slider
                value={mood}
                onValueChange={setMood}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />

              <div className="flex justify-between text-sm text-muted-foreground px-2">
                {moodLabels.map((label, i) => (
                  <span key={i} className="text-xs">
                    {moodEmojis[i]}
                  </span>
                ))}
              </div>
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                What's on your mind? (Optional)
              </label>
              <Textarea
                placeholder="Share your thoughts, feelings, or anything you'd like to note about today..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[150px] resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Check-In"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DailyCheckIn;

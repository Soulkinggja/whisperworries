import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MoodTrendTracker } from "@/components/MoodTrendTracker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CheckIn {
  id: string;
  mood: number;
  note: string | null;
  created_at: string;
}

const DailyCheckIn = () => {
  const [mood, setMood] = useState([3]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkInHistory, setCheckInHistory] = useState<CheckIn[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCheckInHistory();
  }, []);

  const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"];
  const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Great"];

  const fetchCheckInHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("daily_check_ins")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setCheckInHistory(data || []);
    } catch (error) {
      console.error("Error fetching check-in history:", error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("daily_check_ins").insert({
        user_id: user.id,
        mood: mood[0],
        note: note || null,
      });

      if (error) throw error;

      toast({
        title: "✨ Check-in saved!",
        description: "Your daily mood has been recorded.",
      });

      // Refresh history and reset form
      await fetchCheckInHistory();
      setMood([3]);
      setNote("");
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
      <div className="max-w-4xl mx-auto pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/customize")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Check-In Form */}
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

          {/* History & Trends */}
          <div className="space-y-6">
            {/* Mood Trend Tracker */}
            <MoodTrendTracker />

            {/* Check-In History */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Recent Check-Ins</h3>
              </div>
              <ScrollArea className="h-[300px] pr-4">
                {checkInHistory.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No check-ins yet. Start your journey today!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {checkInHistory.map((checkIn, index) => (
                      <div key={checkIn.id}>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">
                                {moodEmojis[checkIn.mood - 1]}
                              </span>
                              <span className="font-medium">
                                {moodLabels[checkIn.mood - 1]}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(checkIn.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          {checkIn.note && (
                            <p className="text-sm text-muted-foreground pl-9">
                              {checkIn.note}
                            </p>
                          )}
                        </div>
                        {index < checkInHistory.length - 1 && (
                          <Separator className="my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;

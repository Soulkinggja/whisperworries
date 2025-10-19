import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface CheckIn {
  id: string;
  mood: number;
  note: string;
  created_at: string;
}

const DailyCheckIn = () => {
  const [mood, setMood] = useState([3]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchCheckIns(user.id);
    });
  }, []);

  const fetchCheckIns = async (userId: string) => {
    const { data, error } = await supabase
      .from("daily_check_ins")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) setCheckIns(data);
  };

  const moodEmojis = ["😢", "😕", "😐", "🙂", "😊"];
  const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Great"];

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("daily_check_ins").insert({
        user_id: user.id,
        mood: mood[0],
        note,
      });

      if (error) throw error;

      toast({
        title: "✨ Check-in saved!",
        description: "Your daily mood has been recorded.",
      });
      
      setMood([3]);
      setNote("");
      fetchCheckIns(user.id);
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

            {/* Submit Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/customize")}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
                size="lg"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Check-In"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Check-in History */}
        {checkIns.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Check-Ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checkIns.map((checkIn) => (
                  <div key={checkIn.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{moodEmojis[checkIn.mood - 1]}</span>
                        <span className="font-medium">{moodLabels[checkIn.mood - 1]}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(checkIn.created_at), "MMM dd, yyyy")}
                      </span>
                    </div>
                    {checkIn.note && (
                      <p className="text-sm text-muted-foreground">{checkIn.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyCheckIn;

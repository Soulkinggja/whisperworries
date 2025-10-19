import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

interface MoodData {
  date: string;
  mood: number;
}

export const MoodTrendTracker = () => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const { data, error } = await supabase
        .from("daily_check_ins")
        .select("mood, created_at")
        .eq("user_id", user.id)
        .gte("created_at", fourteenDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedData = data.map((entry) => ({
        date: new Date(entry.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        mood: entry.mood,
      }));

      setMoodData(formattedData);
    } catch (error) {
      console.error("Error fetching mood data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">Loading mood trends...</div>
      </Card>
    );
  }

  if (moodData.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No mood data yet. Start checking in daily to see your trends!
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">14-Day Mood Trend</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={moodData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-2">
        <span>😢 Very Low</span>
        <span>😕 Low</span>
        <span>😐 Neutral</span>
        <span>🙂 Good</span>
        <span>😊 Great</span>
      </div>
    </Card>
  );
};

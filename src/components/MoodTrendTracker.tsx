import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface MoodData {
  date: string;
  mood: number;
}

export const MoodTrendTracker = ({ userId }: { userId: string }) => {
  const [moodData, setMoodData] = useState<MoodData[]>([]);

  useEffect(() => {
    fetchMoodData();
  }, [userId]);

  const fetchMoodData = async () => {
    const fourteenDaysAgo = subDays(new Date(), 14);

    const { data, error } = await supabase
      .from("daily_check_ins")
      .select("mood, created_at")
      .eq("user_id", userId)
      .gte("created_at", fourteenDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    if (data) {
      const formattedData = data.map((item) => ({
        date: format(new Date(item.created_at), "MM/dd"),
        mood: item.mood,
      }));
      setMoodData(formattedData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>14-Day Mood Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StreakTrackerProps {
  userId?: string;
}

export const StreakTracker = ({ userId }: StreakTrackerProps) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;
    fetchStreak();
  }, [userId]);

  const fetchStreak = async () => {
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCurrentStreak(data.current_streak);
        setLongestStreak(data.longest_streak);
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async () => {
    if (!userId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existing } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        const lastCheckIn = existing.last_check_in_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = existing.current_streak;
        
        if (lastCheckIn === today) {
          return; // Already checked in today
        } else if (lastCheckIn === yesterdayStr) {
          newStreak += 1;
        } else {
          newStreak = 1; // Reset streak
        }

        const newLongest = Math.max(newStreak, existing.longest_streak);

        const { error } = await supabase
          .from('user_streaks')
          .update({
            current_streak: newStreak,
            longest_streak: newLongest,
            last_check_in_date: today
          })
          .eq('user_id', userId);

        if (error) throw error;

        setCurrentStreak(newStreak);
        setLongestStreak(newLongest);

        if (newStreak > 1) {
          toast({
            title: `${newStreak} Day Streak! 🔥`,
            description: "Keep up the great work!",
          });
        }
      } else {
        const { error } = await supabase
          .from('user_streaks')
          .insert({
            user_id: userId,
            current_streak: 1,
            longest_streak: 1,
            last_check_in_date: today
          });

        if (error) throw error;
        setCurrentStreak(1);
        setLongestStreak(1);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  // Auto-update streak when component mounts
  useEffect(() => {
    if (userId && !loading) {
      updateStreak();
    }
  }, [userId, loading]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-card rounded-xl" />;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <h3 className="text-lg font-semibold">Current Streak</h3>
          </div>
          <p className="text-4xl font-bold text-orange-500">{currentStreak}</p>
          <p className="text-sm text-muted-foreground mt-1">days in a row</p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2 justify-end">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h4 className="text-sm font-medium">Best Streak</h4>
          </div>
          <p className="text-2xl font-bold text-yellow-500">{longestStreak}</p>
          <p className="text-xs text-muted-foreground mt-1">personal record</p>
        </div>
      </div>
      
      {/* Visual streak indicators */}
      <div className="mt-4 flex gap-1 flex-wrap">
        {Array.from({ length: Math.min(currentStreak, 30) }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-500 animate-scale-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          />
        ))}
      </div>
    </Card>
  );
};
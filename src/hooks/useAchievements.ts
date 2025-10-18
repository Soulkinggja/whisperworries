import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAchievements = (userId: string | undefined) => {
  const { toast } = useToast();

  const checkAndAwardAchievement = async (achievementType: string) => {
    if (!userId) return;

    try {
      // Check if achievement already exists
      const { data: existing } = await supabase
        .from("achievements")
        .select("id")
        .eq("user_id", userId)
        .eq("achievement_type", achievementType)
        .maybeSingle();

      if (existing) return;

      // Award new achievement
      const { error } = await supabase.from("achievements").insert({
        user_id: userId,
        achievement_type: achievementType,
      });

      if (error) throw error;

      // Show toast notification
      const achievementNames: Record<string, string> = {
        first_worry: "First Step",
        five_worries: "Opening Up",
        ten_worries: "Brave Soul",
        twenty_worries: "Warrior",
        all_use_cases: "Explorer",
        week_streak: "Consistent",
      };

      toast({
        title: "🏆 Achievement Unlocked!",
        description: achievementNames[achievementType] || "New achievement",
      });
    } catch (error) {
      console.error("Error awarding achievement:", error);
    }
  };

  const checkWorryMilestones = async () => {
    if (!userId) return;

    try {
      // Get worry count
      const { count, error } = await supabase
        .from("worries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (error) throw error;

      const worryCount = count || 0;

      // Check milestones - award based on reaching thresholds
      if (worryCount >= 20) {
        await checkAndAwardAchievement("twenty_worries");
      }
      if (worryCount >= 10) {
        await checkAndAwardAchievement("ten_worries");
      }
      if (worryCount >= 5) {
        await checkAndAwardAchievement("five_worries");
      }
      if (worryCount >= 1) {
        await checkAndAwardAchievement("first_worry");
      }

      // Check use case variety
      const { data: useCases } = await supabase
        .from("worries")
        .select("use_case")
        .eq("user_id", userId);

      const uniqueUseCases = new Set(useCases?.map((w) => w.use_case));
      if (uniqueUseCases.size === 5) {
        await checkAndAwardAchievement("all_use_cases");
      }

      // Check for 7-day streak
      const { data: recentWorries } = await supabase
        .from("worries")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(7);

      if (recentWorries && recentWorries.length === 7) {
        const dates = recentWorries.map((w) =>
          new Date(w.created_at).toDateString()
        );
        const uniqueDates = new Set(dates);

        if (uniqueDates.size === 7) {
          const sortedDates = Array.from(uniqueDates)
            .map((d) => new Date(d))
            .sort((a, b) => b.getTime() - a.getTime());

          let isStreak = true;
          for (let i = 0; i < sortedDates.length - 1; i++) {
            const diff =
              (sortedDates[i].getTime() - sortedDates[i + 1].getTime()) /
              (1000 * 60 * 60 * 24);
            if (diff !== 1) {
              isStreak = false;
              break;
            }
          }

          if (isStreak) {
            await checkAndAwardAchievement("week_streak");
          }
        }
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  };

  return { checkWorryMilestones };
};

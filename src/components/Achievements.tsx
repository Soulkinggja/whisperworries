import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Trophy, Sparkles, Heart, Star, Award, Target } from "lucide-react";

interface Achievement {
  id: string;
  achievement_type: string;
  unlocked_at: string;
}

const ACHIEVEMENT_CONFIG = {
  first_worry: {
    title: "First Step",
    description: "Shared your first worry",
    icon: Sparkles,
  },
  five_worries: {
    title: "Opening Up",
    description: "Shared 5 worries",
    icon: Heart,
  },
  ten_worries: {
    title: "Brave Soul",
    description: "Shared 10 worries",
    icon: Trophy,
  },
  twenty_worries: {
    title: "Warrior",
    description: "Shared 20 worries",
    icon: Award,
  },
  all_use_cases: {
    title: "Explorer",
    description: "Tried all use cases",
    icon: Target,
  },
  week_streak: {
    title: "Consistent",
    description: "Shared worries 7 days in a row",
    icon: Star,
  },
};

export const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
      }
    });
  }, []);

  const fetchAchievements = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", userId)
        .order("unlocked_at", { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast({
        title: "Error loading achievements",
        description: "Could not load your achievements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAchievements();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading achievements...</p>
      </div>
    );
  }

  const unlockedTypes = new Set(achievements.map((a) => a.achievement_type));

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          Your <span className="gradient-text">Achievements</span>
        </h2>
        <p className="text-muted-foreground">
          {achievements.length} of {Object.keys(ACHIEVEMENT_CONFIG).length} unlocked
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(ACHIEVEMENT_CONFIG).map(([key, config]) => {
          const isUnlocked = unlockedTypes.has(key);
          const Icon = config.icon;

          return (
            <div
              key={key}
              className={`bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border transition-all ${
                isUnlocked
                  ? "border-primary/40 bg-primary/5"
                  : "border-border opacity-60 grayscale"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    isUnlocked ? "bg-primary/10" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isUnlocked ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    {config.title}
                    {isUnlocked && (
                      <Badge variant="default" className="text-xs">
                        Unlocked
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {config.description}
                  </p>
                  {isUnlocked && (
                    <p className="text-xs text-primary/70 mt-2">
                      {new Date(
                        achievements.find((a) => a.achievement_type === key)!
                          .unlocked_at
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

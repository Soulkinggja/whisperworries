import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, CheckCircle2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target_days: number;
  is_active: boolean;
  created_at: string;
}

interface Completion {
  id: string;
  goal_id: string;
  completed_at: string;
}

export const GoalsHabits = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [newGoal, setNewGoal] = useState({ title: "", description: "", target_days: 7 });
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
    fetchCompletions();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // @ts-ignore - Table exists but types not yet regenerated
      const { data, error }: any = await (supabase as any)
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals((data || []) as Goal[]);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const fetchCompletions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // @ts-ignore - Table exists but types not yet regenerated
      const { data, error }: any = await (supabase as any)
        .from("habit_completions")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setCompletions((data || []) as Completion[]);
    } catch (error) {
      console.error("Error fetching completions:", error);
    }
  };

  const createGoal = async () => {
    if (!newGoal.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your goal.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // @ts-ignore - Table exists but types not yet regenerated
      const { error }: any = await (supabase as any).from("goals").insert({
        user_id: user.id,
        title: newGoal.title,
        description: newGoal.description || null,
        target_days: newGoal.target_days,
      });

      if (error) throw error;

      toast({
        title: "✨ Goal created!",
        description: "Your new goal has been set.",
      });

      setNewGoal({ title: "", description: "", target_days: 7 });
      setIsOpen(false);
      await fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const completeGoal = async (goalId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // @ts-ignore - Table exists but types not yet regenerated
      const { error }: any = await (supabase as any).from("habit_completions").insert({
        user_id: user.id,
        goal_id: goalId,
      });

      if (error) throw error;

      toast({
        title: "🎉 Progress tracked!",
        description: "Keep up the great work!",
      });

      await fetchCompletions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      // @ts-ignore - Table exists but types not yet regenerated
      const { error }: any = await (supabase as any)
        .from("goals")
        .update({ is_active: false })
        .eq("id", goalId);

      if (error) throw error;

      toast({
        title: "Goal archived",
        description: "Your goal has been removed.",
      });

      await fetchGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getGoalProgress = (goalId: string, targetDays: number) => {
    const goalCompletions = completions.filter((c) => c.goal_id === goalId);
    return Math.min((goalCompletions.length / targetDays) * 100, 100);
  };

  const getCompletionCount = (goalId: string) => {
    return completions.filter((c) => c.goal_id === goalId).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          Active Goals
        </h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="transition-all hover:scale-105">
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="animate-scale-in">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Practice mindfulness daily"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your goal..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target Days</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={newGoal.target_days}
                  onChange={(e) => setNewGoal({ ...newGoal, target_days: parseInt(e.target.value) || 7 })}
                />
              </div>
              <Button onClick={createGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">No active goals yet</p>
          <p className="text-sm text-muted-foreground">
            Create a goal to track your wellness journey
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => {
            const progress = getGoalProgress(goal.id, goal.target_days);
            const completionCount = getCompletionCount(goal.id);

            return (
              <Card
                key={goal.id}
                className="p-6 transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-1">{goal.title}</h4>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progress: {completionCount} / {goal.target_days} days
                    </span>
                    <span className="font-medium text-primary">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <Button
                    onClick={() => completeGoal(goal.id)}
                    size="sm"
                    variant="outline"
                    className="w-full transition-all hover:scale-105 hover:border-primary hover:text-primary"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Today Complete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

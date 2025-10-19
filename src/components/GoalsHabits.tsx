import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Check, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface Goal {
  id: string;
  title: string;
  description: string;
  target_days: number;
  is_active: boolean;
  completions?: number;
}

export const GoalsHabits = ({ userId }: { userId: string }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState({ title: "", description: "", target_days: 7 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    const { data: goalsData, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (goalsData) {
      // Fetch completion counts for each goal
      const goalsWithCompletions = await Promise.all(
        goalsData.map(async (goal) => {
          const { count } = await supabase
            .from("habit_completions")
            .select("*", { count: "exact", head: true })
            .eq("goal_id", goal.id)
            .eq("user_id", userId);

          return { ...goal, completions: count || 0 };
        })
      );
      setGoals(goalsWithCompletions);
    }
  };

  const createGoal = async () => {
    if (!newGoal.title) {
      toast({
        title: "Error",
        description: "Please enter a goal title",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("goals").insert({
      user_id: userId,
      title: newGoal.title,
      description: newGoal.description,
      target_days: newGoal.target_days,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create goal",
        variant: "destructive",
      });
    } else {
      toast({ title: "Goal Created!", description: "Keep up the great work!" });
      setNewGoal({ title: "", description: "", target_days: 7 });
      setIsDialogOpen(false);
      fetchGoals();
    }
  };

  const completeGoal = async (goalId: string) => {
    const { error } = await supabase.from("habit_completions").insert({
      user_id: userId,
      goal_id: goalId,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark as complete",
        variant: "destructive",
      });
    } else {
      toast({ title: "Great job!", description: "Habit completed for today!" });
      fetchGoals();
    }
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from("goals")
      .update({ is_active: false })
      .eq("id", goalId);

    if (!error) {
      fetchGoals();
      toast({ title: "Goal removed" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Goals & Habits</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Target days per week"
                value={newGoal.target_days}
                onChange={(e) => setNewGoal({ ...newGoal, target_days: parseInt(e.target.value) })}
              />
              <Button onClick={createGoal} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{goal.title}</h4>
                {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  {goal.completions} / {goal.target_days} days this week
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => completeGoal(goal.id)}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => deleteGoal(goal.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {goals.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No active goals. Create one to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

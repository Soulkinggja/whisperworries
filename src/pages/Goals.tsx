import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Target, Plus } from "lucide-react";

const Goals = () => {
  const navigate = useNavigate();
  const [goals] = useState([
    { id: 1, title: "Check in daily", progress: 71, total: 7, completed: 5 },
    { id: 2, title: "Journal 5 times", progress: 60, total: 5, completed: 3 },
    { id: 3, title: "Breathing exercises", progress: 57, total: 7, completed: 4 },
  ]);

  const [habits] = useState([
    { id: 1, title: "Morning meditation", checked: true },
    { id: 2, title: "Gratitude practice", checked: true },
    { id: 3, title: "Evening reflection", checked: false },
    { id: 4, title: "Physical activity", checked: true },
  ]);

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Goals & Habits</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Weekly Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Weekly Goals
            </CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4" />
              Add Goal
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {goals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{goal.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.completed}/{goal.total}
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Habits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Habits</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4" />
              Add Habit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.map((habit) => (
                <div key={habit.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox id={`habit-${habit.id}`} checked={habit.checked} />
                  <label
                    htmlFor={`habit-${habit.id}`}
                    className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {habit.title}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">63%</div>
                <div className="text-sm text-muted-foreground mt-1">Weekly Progress</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">12</div>
                <div className="text-sm text-muted-foreground mt-1">Goals Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">7</div>
                <div className="text-sm text-muted-foreground mt-1">Day Streak</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Goals;

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { TrendingUp, Brain, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WeeklyInsightsProps {
  userId?: string;
}

export const WeeklyInsights = ({ userId }: WeeklyInsightsProps) => {
  const [insights, setInsights] = useState<string>("");
  const [stats, setStats] = useState({
    checkIns: 0,
    avgMood: 0,
    journalEntries: 0,
    goalsCompleted: 0,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchWeeklyStats();
    }
  }, [userId]);

  const fetchWeeklyStats = async () => {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Fetch check-ins
      const { data: checkIns } = await supabase
        .from('daily_check_ins')
        .select('mood')
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString());

      // Fetch journal entries
      const { data: journals } = await supabase
        .from('journal_entries')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString());

      // Fetch completed goals
      const { data: completions } = await supabase
        .from('habit_completions')
        .select('id')
        .eq('user_id', userId)
        .gte('completed_at', weekAgo.toISOString());

      const avgMood = checkIns && checkIns.length > 0
        ? checkIns.reduce((sum, c) => sum + c.mood, 0) / checkIns.length
        : 0;

      setStats({
        checkIns: checkIns?.length || 0,
        avgMood: Math.round(avgMood * 10) / 10,
        journalEntries: journals?.length || 0,
        goalsCompleted: completions?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const generateInsights = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Get recent check-ins with notes
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { data: checkIns } = await supabase
        .from('daily_check_ins')
        .select('mood, note, created_at')
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(7);

      if (!checkIns || checkIns.length === 0) {
        toast({
          title: "Not enough data",
          description: "Complete more check-ins to get AI insights!",
        });
        return;
      }

      const prompt = `Based on this week's mood tracking data, provide brief, encouraging insights (2-3 sentences):
      
Weekly stats:
- Check-ins: ${stats.checkIns}
- Average mood: ${stats.avgMood}/5
- Journal entries: ${stats.journalEntries}
- Goals completed: ${stats.goalsCompleted}

Recent check-ins:
${checkIns.map(c => `${new Date(c.created_at).toLocaleDateString()}: Mood ${c.mood}/5${c.note ? `, Note: ${c.note}` : ''}`).join('\n')}

Provide encouraging insights focused on patterns and positive reinforcement.`;

      const { data, error } = await supabase.functions.invoke('analyze-worry', {
        body: { worry: prompt, useCase: 'insights' }
      });

      if (error) throw error;

      setInsights(data.suggestion || "Keep up the great work! Your consistent check-ins show real commitment to your well-being. 🌟");
      
      toast({
        title: "Insights Generated! 🧠",
        description: "Check out your personalized weekly summary.",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-semibold">Weekly Insights</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-accent/50 rounded-lg p-3 text-center">
          <Calendar className="w-5 h-5 mx-auto mb-1 text-blue-500" />
          <p className="text-2xl font-bold">{stats.checkIns}</p>
          <p className="text-xs text-muted-foreground">Check-ins</p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-3 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-500" />
          <p className="text-2xl font-bold">{stats.avgMood.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Avg Mood</p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-3 text-center">
          <span className="text-2xl mx-auto mb-1 block">📔</span>
          <p className="text-2xl font-bold">{stats.journalEntries}</p>
          <p className="text-xs text-muted-foreground">Journals</p>
        </div>
        
        <div className="bg-accent/50 rounded-lg p-3 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-orange-500" />
          <p className="text-2xl font-bold">{stats.goalsCompleted}</p>
          <p className="text-xs text-muted-foreground">Goals</p>
        </div>
      </div>

      {/* AI Insights */}
      {insights ? (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
          <p className="text-sm leading-relaxed">{insights}</p>
        </div>
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <Brain className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p className="text-sm mb-4">Generate AI-powered insights from your weekly data</p>
        </div>
      )}

      <Button 
        onClick={generateInsights} 
        disabled={loading || stats.checkIns === 0}
        className="w-full"
        variant="default"
      >
        <Brain className="w-4 h-4 mr-2" />
        {loading ? "Analyzing..." : "Generate Insights"}
      </Button>

      {stats.checkIns === 0 && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Complete at least one check-in to generate insights
        </p>
      )}
    </Card>
  );
};
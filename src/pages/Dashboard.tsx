import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Award, 
  Calendar,
  BookOpen,
  Wind,
  Target,
  Users,
  LifeBuoy,
  LogOut,
  User,
  Send
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [loading, setLoading] = useState(true);
  const [worry, setWorry] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleWorrySubmit = () => {
    if (!worry.trim()) {
      toast({
        title: "Share your worry",
        description: "Write what's on your mind so we can help.",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to AI Advice with the worry
    navigate("/ai-advice", { state: { worry } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
      </div>
    );
  }

  const quotes = [
    "You are stronger than your worries.",
    "Every small step forward is progress.",
    "Your feelings are valid and heard.",
    "Today is a new opportunity for peace.",
    "You're doing better than you think."
  ];

  const dailyQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Whisper Worries</span>
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/customize")}>
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Daily Quote */}
        <Card className="bg-gradient-sunset border-0 text-white">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 flex-shrink-0 animate-pulse" />
              <div>
                <p className="text-xl md:text-2xl font-medium mb-2">{dailyQuote}</p>
                <p className="text-white/80">Your daily encouragement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Worry Input */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              What's worrying you today?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your worries here... We're here to listen and support you."
              value={worry}
              onChange={(e) => setWorry(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <Button
              variant="magical"
              className="w-full"
              onClick={handleWorrySubmit}
            >
              <Send className="w-4 h-4" />
              Get Support
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-card hover:bg-card/80"
            onClick={() => navigate("/check-in")}
          >
            <Heart className="w-6 h-6 text-primary" />
            <span>Check-In</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-card hover:bg-card/80"
            onClick={() => navigate("/journal")}
          >
            <BookOpen className="w-6 h-6 text-secondary" />
            <span>Journal</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-card hover:bg-card/80"
            onClick={() => navigate("/breathing")}
          >
            <Wind className="w-6 h-6 text-accent" />
            <span>Breathe</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-card hover:bg-card/80"
            onClick={() => navigate("/ai-advice")}
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <span>AI Advice</span>
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{currentStreak} days</div>
              <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">↑ 12%</div>
              <p className="text-xs text-muted-foreground mt-1">Better this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
              <Award className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">8</div>
              <p className="text-xs text-muted-foreground mt-1">Achievements unlocked</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goal Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Weekly Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Daily check-ins</span>
                <span className="text-muted-foreground">5/7</span>
              </div>
              <Progress value={71} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Journal entries</span>
                <span className="text-muted-foreground">3/5</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Breathing exercises</span>
                <span className="text-muted-foreground">4/7</span>
              </div>
              <Progress value={57} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm py-2 px-3">
                🔥 7-Day Streak
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-3">
                ✍️ First Journal
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-3">
                🧘 Breathing Master
              </Badge>
              <Badge variant="outline" className="text-sm py-2 px-3">
                🎨 Character Creator
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate("/goals")}
          >
            <Target className="w-6 h-6" />
            <div className="text-center">
              <div className="font-semibold">Goals & Habits</div>
              <div className="text-xs text-muted-foreground">Track your progress</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate("/community")}
          >
            <Users className="w-6 h-6" />
            <div className="text-center">
              <div className="font-semibold">Community</div>
              <div className="text-xs text-muted-foreground">Connect with others</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex-col gap-2"
            onClick={() => navigate("/resources")}
          >
            <LifeBuoy className="w-6 h-6" />
            <div className="text-center">
              <div className="font-semibold">Resources</div>
              <div className="text-xs text-muted-foreground">Get support</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

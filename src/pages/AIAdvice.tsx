import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Send } from "lucide-react";

const AIAdvice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [worry, setWorry] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const getAdvice = (text: string) => {
    const keywords = {
      anxious: "It's okay to feel anxious. Try breaking down what's worrying you into smaller, manageable steps. Remember to breathe.",
      stress: "Stress is your body's way of responding to challenges. Take a moment to step back, breathe deeply, and prioritize what truly matters.",
      lonely: "Feeling lonely is difficult. Remember that you're not alone in feeling this way. Consider reaching out to someone you trust or joining a supportive community.",
      tired: "Rest is not a luxury, it's a necessity. Your body and mind need time to recharge. Be kind to yourself and allow time for rest.",
      overwhelmed: "When everything feels like too much, focus on one thing at a time. You don't have to do everything at once. Small steps count.",
      scared: "Fear is a natural emotion. Acknowledge it, but don't let it control you. What's one small brave thing you can do today?",
      sad: "It's okay to feel sad. Your emotions are valid. Sometimes we need to sit with our feelings before we can move through them.",
    };

    const lowerText = text.toLowerCase();
    for (const [key, response] of Object.entries(keywords)) {
      if (lowerText.includes(key)) {
        return response;
      }
    }

    return "Thank you for sharing. Remember that your feelings are valid. Consider journaling your thoughts or talking to someone you trust. You're taking a brave step by acknowledging how you feel.";
  };

  const handleSubmit = async () => {
    if (!worry.trim()) {
      toast({
        title: "Please share your worry",
        description: "Write what's on your mind so I can offer support.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const response = getAdvice(worry);
      setAdvice(response);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">AI Advice</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Share Your Worry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="What's worrying you today? Share your thoughts here..."
              value={worry}
              onChange={(e) => setWorry(e.target.value)}
              rows={6}
              className="resize-none"
            />
            
            <Button
              variant="magical"
              className="w-full"
              onClick={handleSubmit}
              disabled={loading}
            >
              <Send className="w-4 h-4" />
              {loading ? "Thinking..." : "Get Support"}
            </Button>
          </CardContent>
        </Card>

        {advice && (
          <Card className="bg-gradient-weave border-0 text-white animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Here for You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{advice}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Remember</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>💜 This is supportive guidance, not professional therapy</p>
            <p>🌟 Your feelings are valid and important</p>
            <p>🤝 Consider talking to a trusted friend or professional for deeper support</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAdvice;

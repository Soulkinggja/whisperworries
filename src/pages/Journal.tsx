import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpen, Save, Sparkles } from "lucide-react";

const Journal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzesentiment = (text: string) => {
    const positiveWords = ["happy", "joy", "great", "good", "love", "amazing", "wonderful", "grateful"];
    const negativeWords = ["sad", "worried", "anxious", "fear", "bad", "terrible", "awful", "stressed"];
    
    const words = text.toLowerCase().split(/\s+/);
    const positive = words.filter(w => positiveWords.includes(w)).length;
    const negative = words.filter(w => negativeWords.includes(w)).length;
    
    if (positive > negative) return "positive";
    if (negative > positive) return "challenging";
    return "neutral";
  };

  const handleSave = async () => {
    if (!entry.trim()) {
      toast({
        title: "Entry is empty",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const sentiment = analyzesentiment(entry);
    
    setTimeout(() => {
      toast({
        title: "Journal entry saved!",
        description: `Your ${sentiment} thoughts have been recorded. 💜`,
      });
      setLoading(false);
      setTitle("");
      setEntry("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Journal</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Journal Area */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Write Your Thoughts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Entry title (optional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                
                <Textarea
                  placeholder="What's on your mind? Write freely without judgment..."
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  rows={15}
                  className="resize-none"
                />

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {entry.length} characters
                  </span>
                  <Button
                    variant="magical"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Tips */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Journaling Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>✍️ Write without editing yourself</p>
                <p>🌟 Focus on feelings, not just events</p>
                <p>💭 Ask yourself "why" questions</p>
                <p>🎯 Set an intention before you start</p>
                <p>💜 Be kind to yourself in your words</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prompts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setEntry("Today I'm grateful for...")}
                >
                  What am I grateful for today?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setEntry("I'm worried about...")}
                >
                  What's worrying me right now?
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setEntry("I learned that...")}
                >
                  What did I learn today?
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;

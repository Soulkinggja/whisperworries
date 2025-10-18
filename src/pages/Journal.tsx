import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, Users, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  mood: string | null;
  created_at: string;
  updated_at: string;
}

const Journal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string>("neutral");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        loadEntries(session.user.id);
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

  const loadEntries = async (userId: string) => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading entries:", error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive",
      });
    } else {
      setEntries(data || []);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something in your journal",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    setIsLoading(true);

    try {
      if (editingId) {
        // Update existing entry
        const { error } = await supabase
          .from("journal_entries")
          .update({
            title: title || null,
            content,
            mood,
          })
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Updated",
          description: "Your journal entry has been updated",
        });
      } else {
        // Create new entry
        const { error } = await supabase
          .from("journal_entries")
          .insert({
            user_id: user.id,
            title: title || null,
            content,
            mood,
          });

        if (error) throw error;

        toast({
          title: "Saved",
          description: "Your thoughts have been saved",
        });
      }

      // Clear form and reload
      setTitle("");
      setContent("");
      setMood("neutral");
      setEditingId(null);
      await loadEntries(user.id);
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setTitle(entry.title || "");
    setContent(entry.content);
    setMood(entry.mood || "neutral");
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Deleted",
        description: "Journal entry removed",
      });
      if (user) loadEntries(user.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMoodEmoji = (mood: string | null) => {
    switch (mood) {
      case "happy": return "😊";
      case "sad": return "😢";
      case "anxious": return "😰";
      case "calm": return "😌";
      case "excited": return "🤩";
      case "angry": return "😠";
      default: return "😐";
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/resources")}
            >
              <Heart className="w-4 h-4 mr-2" />
              Resources
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/friends")}
            >
              <Users className="w-4 h-4 mr-2" />
              Support Friends
            </Button>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2">
          Your <span className="gradient-text">Journal</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Write your thoughts, feelings, and experiences
        </p>

        {/* Writing Area */}
        <Card className="p-6 mb-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                placeholder="Give your entry a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="mood">How are you feeling?</Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">😊 Happy</SelectItem>
                  <SelectItem value="sad">😢 Sad</SelectItem>
                  <SelectItem value="anxious">😰 Anxious</SelectItem>
                  <SelectItem value="calm">😌 Calm</SelectItem>
                  <SelectItem value="excited">🤩 Excited</SelectItem>
                  <SelectItem value="angry">😠 Angry</SelectItem>
                  <SelectItem value="neutral">😐 Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Your thoughts</Label>
              <Textarea
                id="content"
                placeholder="Write freely about what's on your mind..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-2 min-h-[200px] resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingId ? "Update Entry" : "Save Entry"}
              </Button>
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setTitle("");
                    setContent("");
                    setMood("neutral");
                    setEditingId(null);
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Past Entries */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Past Entries</h2>
          
          {entries.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>No journal entries yet. Start writing your first entry above!</p>
            </Card>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      {entry.title && (
                        <h3 className="text-xl font-semibold">{entry.title}</h3>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(entry)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-foreground whitespace-pre-wrap">{entry.content}</p>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;

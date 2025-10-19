import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Sparkles, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GratitudeEntry {
  id: string;
  content: string;
  color: string;
  created_at: string;
}

interface GratitudeJarProps {
  userId?: string;
}

export const GratitudeJar = ({ userId }: GratitudeJarProps) => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [newEntry, setNewEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const gratitudeColors = [
    "hsl(270, 65%, 65%)",
    "hsl(200, 70%, 60%)",
    "hsl(330, 75%, 65%)",
    "hsl(45, 70%, 60%)",
    "hsl(140, 60%, 55%)",
  ];

  useEffect(() => {
    if (userId) {
      fetchEntries();
    }
  }, [userId]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('gratitude_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching gratitude:', error);
    }
  };

  const addEntry = async () => {
    if (!newEntry.trim() || !userId) return;

    setLoading(true);
    try {
      const randomColor = gratitudeColors[Math.floor(Math.random() * gratitudeColors.length)];
      
      const { error } = await supabase
        .from('gratitude_entries')
        .insert({
          user_id: userId,
          content: newEntry.trim(),
          color: randomColor,
        });

      if (error) throw error;

      toast({
        title: "Gratitude Added! ✨",
        description: "Your positive thought has been saved.",
      });

      setNewEntry("");
      fetchEntries();
    } catch (error) {
      console.error('Error adding gratitude:', error);
      toast({
        title: "Error",
        description: "Failed to save gratitude.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gratitude_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEntries();
    } catch (error) {
      console.error('Error deleting gratitude:', error);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-6 h-6 text-pink-500" />
        <h3 className="text-xl font-semibold">Gratitude Jar</h3>
        <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Collect moments you're grateful for. Each one is a little treasure! 💝
      </p>

      {/* Add new entry */}
      <div className="space-y-3 mb-6">
        <Textarea
          placeholder="What are you grateful for today?"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
          className="resize-none"
          rows={3}
        />
        <Button 
          onClick={addEntry} 
          disabled={loading || !newEntry.trim()}
          className="w-full"
          variant="default"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Add to Jar
        </Button>
      </div>

      {/* Jar visualization */}
      <div className="relative bg-gradient-to-b from-transparent to-accent/20 rounded-2xl p-6 min-h-[200px] border-2 border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-3 bg-card border-2 border-border rounded-full" />
        
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Your jar is waiting for gratitude notes!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {entries.slice(0, 12).map((entry, index) => (
              <Dialog key={entry.id}>
                <DialogTrigger asChild>
                  <button
                    className="aspect-square rounded-xl p-3 text-xs font-medium text-white shadow-lg hover:scale-110 transition-transform cursor-pointer animate-scale-in"
                    style={{
                      backgroundColor: entry.color,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    {entry.content.slice(0, 30)}...
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-500" />
                      Gratitude Note
                    </DialogTitle>
                    <DialogDescription>
                      {new Date(entry.created_at).toLocaleDateString()}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-foreground">{entry.content}</p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
        
        <p className="text-center mt-4 text-sm text-muted-foreground">
          {entries.length} gratitude {entries.length === 1 ? 'note' : 'notes'} collected
        </p>
      </div>
    </Card>
  );
};
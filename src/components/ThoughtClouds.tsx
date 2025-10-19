import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Thought {
  id: string;
  text: string;
  x: number;
  y: number;
  isDragging: boolean;
  type?: 'kept' | 'released' | null;
}

interface ThoughtCloudsProps {
  userId?: string;
}

export const ThoughtClouds = ({ userId }: ThoughtCloudsProps) => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [newThought, setNewThought] = useState("");
  const [draggedThought, setDraggedThought] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      loadThoughts();
    }
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughts(prev => 
        prev.map(t => {
          if (t.type) return t;
          return {
            ...t,
            y: t.y - 0.5,
            x: t.x + Math.sin(Date.now() / 1000 + parseInt(t.id, 16)) * 0.3
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const loadThoughts = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('worries')
        .select('id, worry_text')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data) {
        setThoughts(data.map((w, i) => ({
          id: w.id,
          text: w.worry_text,
          x: 20 + (i % 3) * 30,
          y: 100 + Math.random() * 50,
          isDragging: false,
          type: null
        })));
      }
    } catch (error) {
      console.error('Error loading thoughts:', error);
    }
  };

  const addThought = async () => {
    if (!newThought.trim() || !userId) return;

    try {
      const { data, error } = await supabase
        .from('worries')
        .insert({
          user_id: userId,
          worry_text: newThought.trim(),
          use_case: 'venting'
        })
        .select()
        .single();

      if (error) throw error;

      setThoughts(prev => [...prev, {
        id: data.id,
        text: newThought.trim(),
        x: 50,
        y: 150,
        isDragging: false,
        type: null
      }]);

      setNewThought("");
      toast({
        title: "Thought added",
        description: "Drag it to let go or keep it",
      });
    } catch (error) {
      console.error('Error adding thought:', error);
    }
  };

  const handleDragStart = (thoughtId: string) => {
    setDraggedThought(thoughtId);
    setThoughts(prev => prev.map(t => 
      t.id === thoughtId ? { ...t, isDragging: true } : t
    ));
  };

  const handleDrag = (e: React.DragEvent, thoughtId: string) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setThoughts(prev => prev.map(t => 
      t.id === thoughtId ? { ...t, x, y } : t
    ));
  };

  const handleDrop = (zone: 'kept' | 'released') => {
    if (!draggedThought) return;

    setThoughts(prev => prev.map(t => 
      t.id === draggedThought 
        ? { ...t, isDragging: false, type: zone } 
        : t
    ));

    toast({
      title: zone === 'kept' ? "Thought kept" : "Thought released",
      description: zone === 'kept' 
        ? "This thought is worth holding onto" 
        : "You've let this thought drift away",
    });

    setDraggedThought(null);
  };

  const keptCount = thoughts.filter(t => t.type === 'kept').length;
  const releasedCount = thoughts.filter(t => t.type === 'released').length;

  return (
    <Card className="p-6 bg-gradient-to-br from-sky-500/10 to-purple-500/10">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Thought Clouds
        </h3>
        <p className="text-sm text-muted-foreground">
          Add thoughts, then drag them to let go or keep them
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="What's on your mind?"
          value={newThought}
          onChange={(e) => setNewThought(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addThought()}
          maxLength={100}
        />
        <Button onClick={addThought} size="sm">
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative h-64 bg-gradient-to-b from-sky-100/50 to-transparent dark:from-sky-900/20 rounded-lg overflow-hidden mb-4">
        {thoughts.filter(t => !t.type).map((thought) => (
          <div
            key={thought.id}
            draggable
            onDragStart={() => handleDragStart(thought.id)}
            onDrag={(e) => handleDrag(e, thought.id)}
            onDragEnd={() => setThoughts(prev => prev.map(t => 
              t.id === thought.id ? { ...t, isDragging: false } : t
            ))}
            className={`absolute cursor-move transition-opacity ${
              thought.isDragging ? 'opacity-50' : 'opacity-100'
            }`}
            style={{
              left: `${thought.x}%`,
              top: `${thought.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-primary/20 max-w-[200px]">
              <p className="text-xs truncate">{thought.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop('released')}
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center hover:border-primary/50 transition-colors"
        >
          <X className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Let Go</p>
          <p className="text-xs text-muted-foreground mt-1">{releasedCount} released</p>
        </div>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop('kept')}
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center hover:border-primary/50 transition-colors"
        >
          <Sparkles className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Keep</p>
          <p className="text-xs text-muted-foreground mt-1">{keptCount} kept</p>
        </div>
      </div>
    </Card>
  );
};

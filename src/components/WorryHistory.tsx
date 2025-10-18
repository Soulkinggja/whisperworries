import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface Worry {
  id: string;
  worry_text: string;
  use_case: string;
  suggestion: string | null;
  created_at: string;
}

export const WorryHistory = () => {
  const [worries, setWorries] = useState<Worry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWorries = async () => {
    try {
      const { data, error } = await supabase
        .from("worries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWorries(data || []);
    } catch (error) {
      console.error("Error fetching worries:", error);
      toast({
        title: "Error loading history",
        description: "Could not load your worry history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteWorry = async (id: string) => {
    try {
      const { error } = await supabase.from("worries").delete().eq("id", id);

      if (error) throw error;

      setWorries(worries.filter((w) => w.id !== id));
      toast({
        title: "Deleted",
        description: "Worry has been removed from your history",
      });
    } catch (error) {
      console.error("Error deleting worry:", error);
      toast({
        title: "Error",
        description: "Could not delete worry",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWorries();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading your history...</p>
      </div>
    );
  }

  if (worries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No worries yet. Start by sharing what's on your mind.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {worries.map((worry) => (
        <div
          key={worry.id}
          className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-border"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {worry.use_case.replace("-", " ")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(worry.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground mb-3">{worry.worry_text}</p>
              {worry.suggestion && (
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm font-medium text-primary mb-1">
                    Suggestion:
                  </p>
                  <p className="text-sm text-foreground">{worry.suggestion}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteWorry(worry.id)}
              className="ml-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

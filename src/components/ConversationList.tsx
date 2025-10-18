import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Trash2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface Conversation {
  id: string;
  title: string | null;
  use_case: string;
  created_at: string;
  updated_at: string;
}

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string | null) => void;
}

export const ConversationList = ({
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) throw error;

      setConversations((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );

      if (selectedConversationId === conversationId) {
        onSelectConversation(null);
      }

      toast({
        title: "Conversation deleted",
        description: "Your conversation has been removed.",
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading conversations...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Conversations</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectConversation(null)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {conversations.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">No conversations yet</p>
          <p className="text-sm text-muted-foreground">
            Start a new conversation to begin
          </p>
        </Card>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedConversationId === conversation.id
                    ? "border-primary bg-primary/5"
                    : ""
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <h4 className="font-medium truncate">
                        {conversation.title || "Untitled conversation"}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-1 rounded-full bg-primary/10">
                        {conversation.use_case.replace("-", " ")}
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(conversation.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conversation.id);
                    }}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

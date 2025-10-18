import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Send, Loader2, MessageCircle, Paperclip, X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  attachment_url?: string | null;
}

interface ConversationThreadProps {
  conversationId: string | null;
  useCase: string;
  onConversationStart: (conversationId: string) => void;
}

export const ConversationThread = ({ 
  conversationId, 
  useCase,
  onConversationStart 
}: ConversationThreadProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!conversationId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("conversation_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages((data || []).map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        created_at: msg.created_at,
        attachment_url: msg.attachment_url,
      })));
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async (file: File, userId: string): Promise<string | null> => {
    setUploadingFile(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("conversation-attachments")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("conversation-attachments")
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    const userMessage = newMessage.trim();
    setNewMessage("");
    setIsTyping(true);
    setIsSending(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let currentConversationId = conversationId;

      // Create new conversation if this is the first message
      if (!currentConversationId) {
        const { data: newConversation, error: convError } = await supabase
          .from("conversations")
          .insert({
            user_id: user.id,
            use_case: useCase,
            title: userMessage.substring(0, 50) || "Photo message",
          })
          .select()
          .single();

        if (convError) throw convError;
        currentConversationId = newConversation.id;
        onConversationStart(currentConversationId);
      }

      // Upload file if present
      let attachmentUrl: string | null = null;
      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile, user.id);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }

      // Save user message
      const { error: userMsgError } = await supabase
        .from("conversation_messages")
        .insert({
          conversation_id: currentConversationId,
          role: "user",
          content: userMessage || "Sent a photo",
          attachment_url: attachmentUrl,
        });

      if (userMsgError) throw userMsgError;

      // Update UI with user message immediately
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "user",
        content: userMessage || "Sent a photo",
        created_at: new Date().toISOString(),
        attachment_url: attachmentUrl,
      }]);

      // Get conversation history for AI context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Get AI response with attachment if present
      const { data, error } = await supabase.functions.invoke("analyze-worry", {
        body: {
          worry: userMessage,
          useCase: useCase,
          conversationHistory: conversationHistory,
          attachmentUrl: attachmentUrl,
        },
      });

      if (error) throw error;

      if (data?.suggestion) {
        // Save assistant message
        const { error: assistantMsgError } = await supabase
          .from("conversation_messages")
          .insert({
            conversation_id: currentConversationId,
            role: "assistant",
            content: data.suggestion,
          });

        if (assistantMsgError) throw assistantMsgError;

        // Update UI with assistant message
        setMessages(prev => [...prev, {
          id: Date.now().toString() + "_ai",
          role: "assistant",
          content: data.suggestion,
          created_at: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      setIsTyping(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {messages.length > 0 ? (
        <ScrollArea className={`flex-1 pr-4 transition-opacity duration-300 ${isTyping ? "opacity-0" : "opacity-100"}`}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[80%] p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">
                        Your Friend
                      </span>
                    </div>
                  )}
                  {message.attachment_url && (
                    <img 
                      src={message.attachment_url} 
                      alt="Attachment" 
                      className="max-w-full rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </Card>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center py-12">
          <div>
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Start a conversation with your friend
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Share what's on your mind and get support
            </p>
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        {selectedFile && (
          <div className="mb-2 flex items-center gap-2 p-2 bg-muted rounded-lg">
            <span className="text-sm truncate flex-1">{selectedFile.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending || uploadingFile}
              className="h-[80px] w-[80px]"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
              className="min-h-[80px] resize-none flex-1"
              disabled={isSending || uploadingFile}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !selectedFile) || isSending || uploadingFile}
            size="icon"
            className="h-[80px] w-[80px]"
          >
            {isSending || uploadingFile ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

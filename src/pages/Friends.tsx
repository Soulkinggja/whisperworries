import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, UserPlus, Users, Mail, Check, X, Loader2 } from "lucide-react";

interface FriendInvitation {
  id: string;
  sender_id: string;
  receiver_email: string;
  receiver_id: string | null;
  status: string;
  created_at: string;
  sender?: {
    id: string;
  };
}

interface FriendConnection {
  id: string;
  user_id_1: string;
  user_id_2: string;
  created_at: string;
}

const Friends = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<FriendInvitation[]>([]);
  const [sentInvitations, setSentInvitations] = useState<FriendInvitation[]>([]);
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setCurrentUserId(session.user.id);
    fetchInvitations(session.user.id);
    fetchFriends(session.user.id);
  };

  const fetchInvitations = async (userId: string) => {
    // Fetch received invitations
    const { data: received, error: receivedError } = await supabase
      .from("friend_invitations")
      .select("*")
      .eq("receiver_id", userId)
      .eq("status", "pending");

    if (receivedError) {
      console.error("Error fetching invitations:", receivedError);
    } else {
      setInvitations(received || []);
    }

    // Fetch sent invitations
    const { data: sent, error: sentError } = await supabase
      .from("friend_invitations")
      .select("*")
      .eq("sender_id", userId)
      .eq("status", "pending");

    if (sentError) {
      console.error("Error fetching sent invitations:", sentError);
    } else {
      setSentInvitations(sent || []);
    }
  };

  const fetchFriends = async (userId: string) => {
    const { data, error } = await supabase
      .from("friend_connections")
      .select("*")
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

    if (error) {
      console.error("Error fetching friends:", error);
    } else {
      setFriends(data || []);
    }
  };

  const sendInvitation = async () => {
    if (!email || !currentUserId) return;

    setLoading(true);
    try {
      // Get receiver's user ID by email
      const { data: lookupData, error: lookupError } = await supabase
        .rpc("get_user_id_by_email", { user_email: email });

      if (lookupError) throw lookupError;

      const { error } = await supabase
        .from("friend_invitations")
        .insert({
          sender_id: currentUserId,
          receiver_email: email,
          receiver_id: lookupData,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "Invitation sent!",
        description: `Friend request sent to ${email}`,
      });
      setEmail("");
      fetchInvitations(currentUserId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvitation = async (invitationId: string, accept: boolean) => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      // Update invitation status
      const { error: updateError } = await supabase
        .from("friend_invitations")
        .update({ status: accept ? "accepted" : "declined" })
        .eq("id", invitationId);

      if (updateError) throw updateError;

      if (accept) {
        // Get the invitation details to create connection
        const invitation = invitations.find((inv) => inv.id === invitationId);
        if (invitation) {
          const { error: connectionError } = await supabase
            .from("friend_connections")
            .insert({
              user_id_1: invitation.sender_id,
              user_id_2: currentUserId,
            });

          if (connectionError) throw connectionError;
        }
      }

      toast({
        title: accept ? "Invitation accepted!" : "Invitation declined",
        description: accept
          ? "You are now friends!"
          : "Invitation has been declined",
      });

      fetchInvitations(currentUserId);
      fetchFriends(currentUserId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process invitation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (connectionId: string) => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("friend_connections")
        .delete()
        .eq("id", connectionId);

      if (error) throw error;

      toast({
        title: "Friend removed",
        description: "Friend connection has been removed",
      });

      fetchFriends(currentUserId);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove friend",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Support Friends
          </h1>
          <Button variant="ghost" onClick={() => navigate("/journal")}>
            Back to Journal
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite a Friend
            </CardTitle>
            <CardDescription>
              Send a friend request by email to connect for mutual support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendInvitation()}
              />
              <Button onClick={sendInvitation} disabled={loading || !email}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="invitations" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invitations">
              Invitations ({invitations.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent ({sentInvitations.length})
            </TabsTrigger>
            <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="invitations" className="space-y-4">
            {invitations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No pending invitations
                </CardContent>
              </Card>
            ) : (
              invitations.map((invitation) => (
                <Card key={invitation.id}>
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">Friend Request</p>
                        <p className="text-sm text-muted-foreground">
                          From: {invitation.receiver_email}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleInvitation(invitation.id, true)}
                        disabled={loading}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleInvitation(invitation.id, false)}
                        disabled={loading}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="space-y-4">
            {sentInvitations.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No pending sent invitations
                </CardContent>
              </Card>
            ) : (
              sentInvitations.map((invitation) => (
                <Card key={invitation.id}>
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">Invitation Pending</p>
                        <p className="text-sm text-muted-foreground">
                          To: {invitation.receiver_email}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        setLoading(true);
                        try {
                          const { error } = await supabase
                            .from("friend_invitations")
                            .delete()
                            .eq("id", invitation.id);

                          if (error) throw error;

                          toast({
                            title: "Invitation cancelled",
                            description: "Your friend invitation has been cancelled",
                          });
                          fetchInvitations(currentUserId!);
                        } catch (error: any) {
                          toast({
                            title: "Error",
                            description: error.message || "Failed to cancel invitation",
                            variant: "destructive",
                          });
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="friends" className="space-y-4">
            {friends.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No friends yet. Send an invitation to get started!
                </CardContent>
              </Card>
            ) : (
              friends.map((friend) => (
                <Card key={friend.id}>
                  <CardContent className="pt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">Support Friend</p>
                        <p className="text-sm text-muted-foreground">
                          Connected since{" "}
                          {new Date(friend.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFriend(friend.id)}
                      disabled={loading}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Friends;

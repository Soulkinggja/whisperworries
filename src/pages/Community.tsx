import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Lock, Heart } from "lucide-react";

const Community = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Community</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="bg-gradient-weave border-0 text-white mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Coming Soon!</h2>
                <p className="text-white/90">
                  We're building a safe, moderated space where you can connect with others 
                  on similar journeys. Share experiences, offer support, and grow together.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Safe & Anonymous
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your privacy is our priority. All interactions are anonymous and moderated 
                to ensure a supportive environment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-secondary" />
                Peer Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with people who understand. Share your journey and learn from others 
                in small, supportive circles.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Planned Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Small Support Circles (3-5 people)</Badge>
              <Badge variant="secondary">Moderated Discussions</Badge>
              <Badge variant="secondary">Anonymous Sharing</Badge>
              <Badge variant="secondary">Weekly Group Challenges</Badge>
              <Badge variant="secondary">Supportive Messaging</Badge>
              <Badge variant="secondary">Community Events</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Want to be notified when Community launches? Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Community;

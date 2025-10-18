import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LifeBuoy, BookOpen, Heart, Phone, Globe, MessageCircle } from "lucide-react";

const Resources = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            <span className="gradient-text">Resources & Support</span>
          </h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Card className="bg-gradient-sunset border-0 text-white">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <LifeBuoy className="w-8 h-8 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-2">You're Not Alone</h2>
                <p className="text-white/90">
                  If you're in crisis or need immediate support, please reach out to a 
                  professional crisis service or emergency services in your area.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Mental Health Basics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Understanding Your Mental Health</h3>
              <p className="text-sm text-muted-foreground">
                Mental health includes our emotional, psychological, and social well-being. 
                It affects how we think, feel, and act.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">When to Seek Help</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Persistent feelings of sadness or hopelessness</li>
                <li>• Difficulty functioning in daily life</li>
                <li>• Changes in sleep or appetite</li>
                <li>• Withdrawing from friends and activities</li>
                <li>• Thoughts of self-harm</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-secondary" />
              Self-Care Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Daily Practices</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Regular sleep schedule</li>
                  <li>✓ Physical activity</li>
                  <li>✓ Healthy nutrition</li>
                  <li>✓ Social connections</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Coping Tools</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Breathing exercises</li>
                  <li>✓ Journaling</li>
                  <li>✓ Mindfulness practice</li>
                  <li>✓ Creative expression</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-accent" />
              Crisis Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Emergency Services</h4>
                  <p className="text-sm text-muted-foreground">
                    If you're in immediate danger, call your local emergency number
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Crisis Text Lines</h4>
                  <p className="text-sm text-muted-foreground">
                    Text-based support available 24/7 for those who prefer messaging
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Online Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Many organizations offer online chat and resources for mental health support
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Whisper Worries is designed to support your mental wellness journey but is not a 
              substitute for professional mental health care. If you're experiencing a mental 
              health crisis or need therapeutic support, please reach out to a qualified mental 
              health professional or crisis service in your area.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Resources;

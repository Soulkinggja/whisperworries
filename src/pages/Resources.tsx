import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, Globe, Heart, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Resources = () => {
  const navigate = useNavigate();

  const emergencyContacts = [
    {
      name: "Emergency Services",
      number: "119",
      description: "Fire, Medical & Rescue Emergency",
      icon: <AlertCircle className="w-6 h-6" />,
    },
    {
      name: "Police Emergency",
      number: "119",
      description: "For immediate police assistance",
      icon: <Phone className="w-6 h-6" />,
    },
    {
      name: "Bellevue Crisis Line",
      number: "1-888-991-4444",
      description: "24/7 Mental Health Crisis Support",
      icon: <MessageCircle className="w-6 h-6" />,
    },
  ];

  const supportResources = [
    {
      title: "Mental Health Jamaica",
      description: "Professional mental health services and counseling",
      contact: "876-XXX-XXXX",
      website: "mentalhealthja.org",
    },
    {
      title: "Caribbean Centre for Mental Health",
      description: "Community-based mental health support",
      contact: "876-XXX-XXXX",
      website: "ccmh.org.jm",
    },
    {
      title: "University Hospital Psychiatry",
      description: "Psychiatric services and emergency care",
      contact: "876-927-1620",
      website: "uhwi.gov.jm",
    },
  ];

  const selfCareResources = [
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Breathing Exercises",
      description: "Try the 4-7-8 technique: Breathe in for 4, hold for 7, exhale for 8",
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Talk to Someone",
      description: "Reach out to a trusted friend, family member, or counselor",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Online Support Groups",
      description: "Connect with others who understand what you're going through",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">Mental Health Resources</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              You're not alone. Help is available 24/7.
            </p>
          </div>

          {/* Emergency Contacts */}
          <Card className="bg-destructive/10 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
                <AlertCircle className="w-6 h-6" />
                Emergency Contacts
              </CardTitle>
              <CardDescription>
                If you're in immediate danger or experiencing a mental health crisis, call these numbers now.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-[var(--shadow-soft)]"
                >
                  <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0 text-destructive">
                    {contact.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{contact.description}</p>
                    <a
                      href={`tel:${contact.number}`}
                      className="text-2xl font-bold text-destructive hover:underline"
                    >
                      {contact.number}
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Support Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Professional Support Services</CardTitle>
              <CardDescription>
                Connect with mental health professionals and organizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportResources.map((resource, index) => (
                <div
                  key={index}
                  className="p-4 bg-muted rounded-lg space-y-2"
                >
                  <h3 className="font-bold text-lg">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.description}</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <a
                      href={`tel:${resource.contact}`}
                      className="text-primary hover:underline font-medium flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {resource.contact}
                    </a>
                    <a
                      href={`https://${resource.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      {resource.website}
                    </a>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Self-Care Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Immediate Self-Care Tips</CardTitle>
              <CardDescription>
                Simple techniques you can try right now to help manage difficult feelings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selfCareResources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                    {resource.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Support Message */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center space-y-4">
              <Heart className="w-12 h-12 text-primary mx-auto" />
              <p className="text-lg">
                Remember: Seeking help is a sign of strength, not weakness. Your mental health matters.
              </p>
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate("/journal")}
              >
                Return to Journal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, Globe, Heart, ArrowLeft, AlertCircle, Brain, Users, BookOpen, Smile, HeartPulse, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      number: "1-876-928-1380-9",
      description: "24/7 Mental Health Crisis Support",
      icon: <MessageCircle className="w-6 h-6" />,
    },
  ];

  const supportResources = [
    {
      title: "Mental Health HelpLine",
      description: "Professional mental health services and counseling",
      contact: "888-(639-5433)",
      website: "https://www.moh.gov.jm/mental-health-unit/",
    },
    {
      title: "U-Matter",
      description: "Counseling Services",
      contact: "876-838 - 4897",
      website: "https://jamaica.ureport.in",
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

  const copingStrategies = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Mindfulness & Meditation",
      tips: [
        "Take 5 minutes to focus on your breathing",
        "Use guided meditation apps like Headspace or Calm",
        "Practice body scan relaxation before bed",
      ],
    },
    {
      icon: <HeartPulse className="w-6 h-6" />,
      title: "Physical Wellness",
      tips: [
        "Go for a 15-minute walk outside",
        "Do simple stretches or yoga",
        "Drink water and eat regular meals",
      ],
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Creative Expression",
      tips: [
        "Journal your thoughts and feelings",
        "Draw, paint, or color",
        "Listen to calming or uplifting music",
      ],
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Social Connection",
      tips: [
        "Text or call a friend",
        "Join an online or in-person support group",
        "Volunteer in your community",
      ],
    },
  ];

  const educationalResources = [
    {
      title: "Understanding Anxiety",
      description: "Learn about anxiety symptoms, triggers, and management techniques",
      emoji: "🧠",
    },
    {
      title: "Depression Awareness",
      description: "Recognize signs of depression and when to seek professional help",
      emoji: "💙",
    },
    {
      title: "Stress Management",
      description: "Practical tools for handling daily stress and building resilience",
      emoji: "🌟",
    },
    {
      title: "Building Self-Esteem",
      description: "Activities and practices to develop a positive self-image",
      emoji: "💪",
    },
  ];

  const youthResources = [
    {
      title: "Kids Help Phone",
      description: "Free, 24/7 counseling for young people",
      contact: "Text CONNECT to 686868",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      title: "Teen Line",
      description: "Teens helping teens through peer support",
      contact: "Text TEEN to 839863",
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: "Youth Mental Health Resources",
      description: "Age-appropriate information and support",
      website: "youthmentalhealth.com",
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">Mental Health Resources</span>
            </h1>
            <p className="text-xl text-muted-foreground">You're not alone. Help is available 24/7.</p>
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
                <div key={index} className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-[var(--shadow-soft)]">
                  <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0 text-destructive">
                    {contact.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{contact.description}</p>
                    <a href={`tel:${contact.number}`} className="text-2xl font-bold text-destructive hover:underline">
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
              <CardDescription>Connect with mental health professionals and organizations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportResources.map((resource, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg space-y-2">
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

          {/* Tabbed Content */}
          <Tabs defaultValue="self-care" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="self-care">Self-Care</TabsTrigger>
              <TabsTrigger value="coping">Coping Tools</TabsTrigger>
              <TabsTrigger value="learn">Learn More</TabsTrigger>
              <TabsTrigger value="youth">Youth Support</TabsTrigger>
            </TabsList>

            {/* Self-Care Tips */}
            <TabsContent value="self-care">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Immediate Self-Care Tips</CardTitle>
                  <CardDescription>
                    Simple techniques you can try right now to help manage difficult feelings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selfCareResources.map((resource, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
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
            </TabsContent>

            {/* Coping Strategies */}
            <TabsContent value="coping">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Coping Strategies</CardTitle>
                  <CardDescription>
                    Healthy ways to manage stress and difficult emotions
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  {copingStrategies.map((strategy, index) => (
                    <div key={index} className="p-6 bg-muted rounded-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          {strategy.icon}
                        </div>
                        <h3 className="font-bold text-lg">{strategy.title}</h3>
                      </div>
                      <ul className="space-y-2 ml-2">
                        {strategy.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Smile className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Educational Resources */}
            <TabsContent value="learn">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Mental Health Education</CardTitle>
                  <CardDescription>
                    Learn more about mental health topics and conditions
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {educationalResources.map((resource, index) => (
                    <div key={index} className="p-6 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                      <div className="text-4xl mb-3">{resource.emoji}</div>
                      <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Youth-Specific Resources */}
            <TabsContent value="youth">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Youth Mental Health Support</CardTitle>
                  <CardDescription>
                    Resources specifically designed for young people
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {youthResources.map((resource, index) => (
                    <div key={index} className="p-6 bg-muted rounded-lg space-y-2">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          {resource.icon}
                        </div>
                        <h3 className="font-bold text-lg">{resource.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-13">{resource.description}</p>
                      {resource.contact && (
                        <p className="font-medium text-primary ml-13">{resource.contact}</p>
                      )}
                      {resource.website && (
                        <a
                          href={`https://${resource.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium flex items-center gap-2 ml-13"
                        >
                          <Globe className="w-4 h-4" />
                          {resource.website}
                        </a>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Resources;

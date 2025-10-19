import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, Globe, Heart, ArrowLeft, AlertCircle, Brain, Users, BookOpen, Smile, HeartPulse, Music, Plus, Trash2, Edit, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emergencyContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  relationship: z.string().trim().min(1, "Relationship is required").max(50, "Relationship must be less than 50 characters"),
  phone_number: z.string().trim().min(1, "Phone number is required").max(20, "Phone number must be less than 20 characters"),
  email: z.string().trim().email("Invalid email").max(255, "Email must be less than 255 characters").optional().or(z.literal("")),
  notes: z.string().trim().max(500, "Notes must be less than 500 characters").optional().or(z.literal("")),
});

type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone_number: string;
  email?: string | null;
  notes?: string | null;
};

const Resources = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone_number: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmergencyContacts(data || []);
    } catch (error) {
      console.error("Error loading emergency contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load emergency contacts",
        variant: "destructive",
      });
    }
  };

  const handleSaveContact = async () => {
    try {
      const validated = emergencyContactSchema.parse(formData);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const contactData = {
        name: validated.name,
        relationship: validated.relationship,
        phone_number: validated.phone_number,
        email: validated.email || null,
        notes: validated.notes || null,
      };

      if (editingContact) {
        const { error } = await supabase
          .from("emergency_contacts")
          .update(contactData)
          .eq("id", editingContact.id);

        if (error) throw error;
        toast({ title: "Success", description: "Contact updated successfully" });
      } else {
        const { error } = await supabase
          .from("emergency_contacts")
          .insert({
            ...contactData,
            user_id: user.id,
          });

        if (error) throw error;
        toast({ title: "Success", description: "Contact added successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      loadEmergencyContacts();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        console.error("Error saving contact:", error);
        toast({
          title: "Error",
          description: "Failed to save contact",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Contact deleted successfully" });
      loadEmergencyContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      relationship: "",
      phone_number: "",
      email: "",
      notes: "",
    });
    setEditingContact(null);
  };

  const openEditDialog = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone_number: contact.phone_number,
      email: contact.email || "",
      notes: contact.notes || "",
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const emergencyHotlines = [
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

          {/* Emergency Hotlines */}
          <Card className="bg-destructive/10 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
                <AlertCircle className="w-6 h-6" />
                Emergency Hotlines
              </CardTitle>
              <CardDescription>
                If you're in immediate danger or experiencing a mental health crisis, call these numbers now.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyHotlines.map((contact, index) => (
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
          <Tabs defaultValue="my-contacts" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="my-contacts">My Contacts</TabsTrigger>
              <TabsTrigger value="self-care">Self-Care</TabsTrigger>
              <TabsTrigger value="coping">Coping Tools</TabsTrigger>
              <TabsTrigger value="learn">Learn More</TabsTrigger>
            </TabsList>

            {/* Emergency Contacts Management */}
            <TabsContent value="my-contacts">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">My Emergency Contacts</CardTitle>
                      <CardDescription>
                        Save contacts of trusted people you can reach out to in case of emergency
                      </CardDescription>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={openAddDialog}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Contact
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingContact ? "Edit" : "Add"} Emergency Contact</DialogTitle>
                          <DialogDescription>
                            Add someone you trust to reach out to in times of need
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="John Doe"
                              maxLength={100}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship *</Label>
                            <Input
                              id="relationship"
                              value={formData.relationship}
                              onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                              placeholder="Friend, Parent, Therapist, etc."
                              maxLength={50}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              value={formData.phone_number}
                              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                              placeholder="+1 (555) 123-4567"
                              maxLength={20}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email (Optional)</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="john@example.com"
                              maxLength={255}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="Any additional information..."
                              maxLength={500}
                              rows={3}
                            />
                          </div>
                          <Button onClick={handleSaveContact} className="w-full">
                            {editingContact ? "Update" : "Save"} Contact
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {emergencyContacts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No emergency contacts added yet.</p>
                      <p className="text-sm">Add someone you trust to reach out to in times of need.</p>
                    </div>
                  ) : (
                    emergencyContacts.map((contact) => (
                      <div key={contact.id} className="p-4 bg-muted rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{contact.name}</h3>
                            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                            {contact.notes && (
                              <p className="text-sm text-muted-foreground mt-2">{contact.notes}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(contact)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            asChild
                          >
                            <a href={`tel:${contact.phone_number}`}>
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={`sms:${contact.phone_number}`}>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Text
                            </a>
                          </Button>
                          {contact.email && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={`mailto:${contact.email}`}>
                                <Mail className="w-4 h-4 mr-2" />
                                Email
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

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

          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Resources;

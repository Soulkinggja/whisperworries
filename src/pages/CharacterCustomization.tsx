import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, LogOut, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorryHistory } from "@/components/WorryHistory";
import { Achievements } from "@/components/Achievements";
import { useAchievements } from "@/hooks/useAchievements";
import type { User } from "@supabase/supabase-js";

const CharacterCustomization = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [selectedColor, setSelectedColor] = useState("hsl(210, 100%, 50%)");
  const [selectedShape, setSelectedShape] = useState("square");
  const [selectedFace, setSelectedFace] = useState("happy");
  const [characterName, setCharacterName] = useState("");
  const [characterGender, setCharacterGender] = useState("");
  const [characterSaved, setCharacterSaved] = useState(false);
  const [worries, setWorries] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState("venting");
  const [activeTab, setActiveTab] = useState("new");
  const { toast } = useToast();
  const { checkWorryMilestones } = useAchievements(user?.id);

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSubmitWorry = async () => {
    if (!worries.trim()) {
      toast({
        title: "Please enter your worries",
        description: "Your companion needs to know what's troubling you.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your worries.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setSuggestion("");

    try {
      const { data, error } = await supabase.functions.invoke('analyze-worry', {
        body: { worry: worries, useCase: selectedUseCase }
      });

      if (error) throw error;

      if (data?.suggestion) {
        setSuggestion(data.suggestion);
        
        // Animate mouth based on text length (roughly 150 words per minute)
        const wordCount = data.suggestion.split(' ').length;
        const speakingDuration = (wordCount / 150) * 60 * 1000; // Convert to milliseconds
        setIsSpeaking(true);
        
        setTimeout(() => {
          setIsSpeaking(false);
        }, speakingDuration);
        
        // Try to generate and play speech (optional, won't block animation)
        try {
          const { data: speechData, error: speechError } = await supabase.functions.invoke('text-to-speech', {
            body: { text: data.suggestion }
          });

          if (!speechError && speechData?.audioContent) {
            // Convert base64 to audio and play
            const audioBlob = new Blob(
              [Uint8Array.from(atob(speechData.audioContent), c => c.charCodeAt(0))],
              { type: 'audio/mpeg' }
            );
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            audio.onended = () => {
              URL.revokeObjectURL(audioUrl);
            };
            
            audio.onerror = () => {
              URL.revokeObjectURL(audioUrl);
            };
            
            await audio.play();
          }
        } catch (speechError) {
          console.error('Error playing speech:', speechError);
        }

        // Save to database
        const { error: dbError } = await supabase.from("worries").insert({
          user_id: user.id,
          worry_text: worries,
          use_case: selectedUseCase,
          suggestion: data.suggestion,
        });

        if (dbError) {
          console.error("Error saving worry:", dbError);
          toast({
            title: "Warning",
            description: "Suggestion received but couldn't save to history.",
            variant: "destructive",
          });
        } else {
          // Check for achievements after successfully saving worry
          checkWorryMilestones();
        }
      } else {
        throw new Error('No suggestion received');
      }
    } catch (error) {
      console.error('Error getting suggestion:', error);
      toast({
        title: "Something went wrong",
        description: "Your companion couldn't process your worry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const colors = [
    { name: "Blue", value: "hsl(210, 100%, 50%)" },
    { name: "Purple", value: "hsl(280, 80%, 60%)" },
    { name: "Pink", value: "hsl(330, 80%, 60%)" },
    { name: "Orange", value: "hsl(30, 90%, 55%)" },
    { name: "Green", value: "hsl(150, 60%, 50%)" },
  ];

  const shapes = ["square", "rounded"];
  
  const faces = [
    { name: "Happy", value: "happy" },
    { name: "Calm", value: "calm" },
    { name: "Neutral", value: "neutral" },
    { name: "Cheerful", value: "cheerful" },
    { name: "Sad", value: "sad" },
    { name: "Angry", value: "angry" },
  ];

  if (characterSaved) {
    return (
      <div className="min-h-screen bg-background px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Share Your <span className="gradient-text">Worries</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Your companion is here to listen
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/journal")}>
                <BookOpen className="w-4 h-4 mr-2" />
                Journal
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="new">New Worry</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Character Preview */}
            <div className="bg-card rounded-3xl p-12 shadow-[var(--shadow-soft)] flex flex-col items-center justify-center min-h-[400px] gap-6">
              {characterName && (
                <h2 className="text-2xl font-bold gradient-text">{characterName}</h2>
              )}
              <div className="relative flex flex-col items-center gap-1">
                {/* Head */}
                <div
                  className="transition-all duration-300 relative flex items-center justify-center"
                  style={{
                    width: characterGender === "female" ? "88px" : "96px",
                    height: characterGender === "female" ? "88px" : "96px",
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "16px" : "12px") : "50%",
                  }}
                >
                  {/* Face */}
                  <div className="flex flex-col items-center gap-2">
                    {/* Eyes */}
                    <div className="flex gap-3">
                      <div 
                        className="w-3 h-3 bg-foreground rounded-full"
                        style={{
                          height: selectedFace === "calm" ? "2px" : 
                                  selectedFace === "angry" ? "2px" : "12px",
                          transform: selectedFace === "angry" ? "rotate(-20deg)" : "none",
                        }}
                      />
                      <div 
                        className="w-3 h-3 bg-foreground rounded-full"
                        style={{
                          height: selectedFace === "calm" ? "2px" : 
                                  selectedFace === "angry" ? "2px" : "12px",
                          transform: selectedFace === "angry" ? "rotate(20deg)" : "none",
                        }}
                      />
                    </div>
                    {/* Mouth */}
                    <div 
                      className={`w-8 h-1 bg-foreground rounded-full transition-all duration-150 ${
                        isSpeaking ? 'animate-[mouth-talk_0.3s_ease-in-out_infinite]' : ''
                      }`}
                      style={{
                        borderRadius: selectedFace === "happy" ? "0 0 100px 100px" : 
                                     selectedFace === "cheerful" ? "0 0 100px 100px" :
                                     selectedFace === "sad" ? "100px 100px 0 0" :
                                     selectedFace === "angry" ? "0" :
                                     selectedFace === "calm" ? "100px" : "100px",
                        height: selectedFace === "happy" ? "8px" : 
                                selectedFace === "cheerful" ? "10px" : 
                                selectedFace === "sad" ? "6px" :
                                selectedFace === "angry" ? "3px" : "4px",
                      }}
                    />
                  </div>
                </div>
                
                {/* Body */}
                <div
                  className="transition-all duration-300"
                  style={{
                    width: characterGender === "female" ? "104px" : "128px",
                    height: characterGender === "female" ? "120px" : "136px",
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "16px" : "12px") : "50%",
                    opacity: 0.9,
                  }}
                />
                
                {/* Arms */}
                <div 
                  className="absolute flex"
                  style={{
                    top: characterGender === "female" ? "95px" : "100px",
                    gap: characterGender === "female" ? "88px" : "112px"
                  }}
                >
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: characterGender === "female" ? "40px" : "52px",
                      height: characterGender === "female" ? "104px" : "120px",
                      backgroundColor: selectedColor,
                      borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "12px" : "8px") : "50%",
                      opacity: 0.85,
                    }}
                  />
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: characterGender === "female" ? "40px" : "52px",
                      height: characterGender === "female" ? "104px" : "120px",
                      backgroundColor: selectedColor,
                      borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "12px" : "8px") : "50%",
                      opacity: 0.85,
                    }}
                  />
                </div>
                
                {/* Legs */}
                <div className="flex gap-2">
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: characterGender === "female" ? "44px" : "56px",
                      height: characterGender === "female" ? "120px" : "136px",
                      backgroundColor: selectedColor,
                      borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "14px" : "10px") : "50%",
                      opacity: 0.85,
                    }}
                  />
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: characterGender === "female" ? "44px" : "56px",
                      height: characterGender === "female" ? "120px" : "136px",
                      backgroundColor: selectedColor,
                      borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "14px" : "10px") : "50%",
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Worries Input */}
            <div className="space-y-6">
              <div className="bg-card rounded-3xl p-6 shadow-[var(--shadow-soft)]">
                {/* Feeling Selector */}
                <div className="mb-6">
                  <label className="text-lg font-semibold mb-3 block">How are you feeling today?</label>
                  <Select value={selectedFace} onValueChange={setSelectedFace}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select how you're feeling" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="happy">😊 Happy</SelectItem>
                      <SelectItem value="calm">😌 Calm</SelectItem>
                      <SelectItem value="neutral">😐 Neutral</SelectItem>
                      <SelectItem value="cheerful">😄 Cheerful</SelectItem>
                      <SelectItem value="sad">😢 Sad</SelectItem>
                      <SelectItem value="angry">😠 Angry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">I want to use this for:</label>
                  <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a use case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venting">Venting</SelectItem>
                      <SelectItem value="journaling">Journaling</SelectItem>
                      <SelectItem value="problem-solving">Problem Solving</SelectItem>
                      <SelectItem value="emotional-support">Emotional Support</SelectItem>
                      <SelectItem value="self-reflection">Self-Reflection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={worries}
                  onChange={(e) => setWorries(e.target.value)}
                  placeholder="Type your worries here..."
                  className="min-h-[300px] text-lg resize-none"
                  disabled={isLoading}
                />
              </div>
              
              {suggestion && (
                <div className="bg-card rounded-3xl p-6 shadow-[var(--shadow-soft)] border-2 border-primary/20">
                  <h3 className="text-lg font-semibold mb-3 text-primary">Your companion suggests:</h3>
                  <p className="text-base text-foreground leading-relaxed">{suggestion}</p>
                </div>
              )}
              
              <Button 
                variant="magical" 
                size="lg" 
                className="w-full text-lg"
                onClick={handleSubmitWorry}
                disabled={isLoading}
              >
                <Sparkles className="w-5 h-5" />
                {isLoading ? "Thinking..." : "Submit"}
              </Button>
            </div>
          </div>
            </TabsContent>

            <TabsContent value="history">
              <WorryHistory />
            </TabsContent>

            <TabsContent value="achievements">
              <Achievements />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your <span className="gradient-text">Block Character</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Customize your companion to reflect your unique personality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Preview */}
          <div className="bg-card rounded-3xl p-12 shadow-[var(--shadow-soft)] flex flex-col items-center justify-center min-h-[400px] gap-6">
            {characterName && (
              <h2 className="text-2xl font-bold gradient-text">{characterName}</h2>
            )}
            <div className="relative flex flex-col items-center gap-1">
              {/* Head */}
              <div
                className="transition-all duration-300 relative flex items-center justify-center"
                style={{
                  width: characterGender === "female" ? "88px" : "96px",
                  height: characterGender === "female" ? "88px" : "96px",
                  backgroundColor: selectedColor,
                  borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "16px" : "12px") : "50%",
                }}
              >
                {/* Face */}
                <div className="flex flex-col items-center gap-2">
                  {/* Eyes */}
                  <div className="flex gap-3">
                    <div 
                      className="w-3 h-3 bg-foreground rounded-full"
                      style={{
                        height: selectedFace === "calm" ? "2px" : 
                                selectedFace === "angry" ? "2px" : "12px",
                        transform: selectedFace === "angry" ? "rotate(-20deg)" : "none",
                      }}
                    />
                    <div 
                      className="w-3 h-3 bg-foreground rounded-full"
                      style={{
                        height: selectedFace === "calm" ? "2px" : 
                                selectedFace === "angry" ? "2px" : "12px",
                        transform: selectedFace === "angry" ? "rotate(20deg)" : "none",
                      }}
                    />
                  </div>
                  {/* Mouth */}
                  <div 
                    className="w-8 h-1 bg-foreground rounded-full"
                    style={{
                      borderRadius: selectedFace === "happy" ? "0 0 100px 100px" : 
                                   selectedFace === "cheerful" ? "0 0 100px 100px" :
                                   selectedFace === "sad" ? "100px 100px 0 0" :
                                   selectedFace === "angry" ? "0" :
                                   selectedFace === "calm" ? "100px" : "100px",
                      height: selectedFace === "happy" ? "8px" : 
                              selectedFace === "cheerful" ? "10px" : 
                              selectedFace === "sad" ? "6px" :
                              selectedFace === "angry" ? "3px" : "4px",
                    }}
                  />
                </div>
              </div>
              
              {/* Body */}
              <div
                className="transition-all duration-300"
                style={{
                  width: characterGender === "female" ? "104px" : "128px",
                  height: characterGender === "female" ? "120px" : "136px",
                  backgroundColor: selectedColor,
                  borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "16px" : "12px") : "50%",
                  opacity: 0.9,
                }}
              />
              
              {/* Arms */}
              <div 
                className="absolute flex"
                style={{
                  top: characterGender === "female" ? "95px" : "100px",
                  gap: characterGender === "female" ? "88px" : "112px"
                }}
              >
                <div
                  className="transition-all duration-300"
                  style={{
                    width: characterGender === "female" ? "40px" : "52px",
                    height: characterGender === "female" ? "104px" : "120px",
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "12px" : "8px") : "50%",
                    opacity: 0.85,
                  }}
                />
                <div
                  className="transition-all duration-300"
                  style={{
                    width: characterGender === "female" ? "40px" : "52px",
                    height: characterGender === "female" ? "104px" : "120px",
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "12px" : "8px") : "50%",
                    opacity: 0.85,
                  }}
                />
              </div>
              
              {/* Legs */}
              <div className="flex gap-2">
                <div
                  className="transition-all duration-300"
                  style={{
                    width: characterGender === "female" ? "44px" : "56px",
                    height: characterGender === "female" ? "120px" : "136px",
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "14px" : "10px") : "50%",
                    opacity: 0.85,
                  }}
                />
                <div
                  className="transition-all duration-300"
                  style={{
                    width: characterGender === "female" ? "44px" : "56px",
                    height: characterGender === "female" ? "120px" : "136px",
                    backgroundColor: selectedColor,
                    borderRadius: selectedShape === "square" ? "4px" : selectedShape === "rounded" ? (characterGender === "female" ? "14px" : "10px") : "50%",
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-8">
            {/* Name */}
            <div>
              <Label htmlFor="character-name" className="text-xl font-semibold mb-4 block">
                Name Your Character
              </Label>
              <Input
                id="character-name"
                type="text"
                placeholder="Enter a name..."
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="text-lg"
                maxLength={20}
              />
            </div>

            {/* Gender */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Gender</h3>
              <Select value={characterGender} onValueChange={setCharacterGender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
              </Select>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Color</h3>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-16 h-16 rounded-xl transition-all hover:scale-110 ${
                      selectedColor === color.value ? "ring-4 ring-primary ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Shapes */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Shape</h3>
              <div className="flex gap-3">
                {shapes.map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setSelectedShape(shape)}
                    className={`px-6 py-3 rounded-xl border-2 transition-all hover:scale-105 capitalize ${
                      selectedShape === shape
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card"
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Face */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose Face</h3>
              <div className="flex gap-3 flex-wrap">
                {faces.map((face) => (
                  <button
                    key={face.value}
                    onClick={() => setSelectedFace(face.value)}
                    className={`px-6 py-3 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedFace === face.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card"
                    }`}
                  >
                    {face.name}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              variant="magical" 
              size="lg" 
              className="w-full text-lg"
              onClick={() => setCharacterSaved(true)}
            >
              <Sparkles className="w-5 h-5" />
              Save Character
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomization;

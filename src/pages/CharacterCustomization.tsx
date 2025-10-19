import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, LogOut, BookOpen, User as UserIcon, MessageSquare, Clock, Trophy, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WorryHistory } from "@/components/WorryHistory";
import { Achievements } from "@/components/Achievements";
import { ConversationThread } from "@/components/ConversationThread";
import { ConversationList } from "@/components/ConversationList";
import { FriendCharacter } from "@/components/FriendCharacter";
import { useAchievements } from "@/hooks/useAchievements";
import { GoalsHabits } from "@/components/GoalsHabits";
import { ColorPicker } from "@/components/ui/color-picker";
import { StreakTracker } from "@/components/StreakTracker";
import { GratitudeJar } from "@/components/GratitudeJar";
import { ThoughtClouds } from "@/components/ThoughtClouds";
import { MoodCalendar } from "@/components/MoodCalendar";
import { WeeklyInsights } from "@/components/WeeklyInsights";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import type { User } from "@supabase/supabase-js";

const CharacterCustomization = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [selectedColor, setSelectedColor] = useState("character-gradient-blue");
  const [customColor, setCustomColor] = useState("hsl(270, 65%, 65%)");
  const [selectedShape, setSelectedShape] = useState("circle");
  const [selectedFace, setSelectedFace] = useState("happy");
  const [characterName, setCharacterName] = useState("");
  const [characterSaved, setCharacterSaved] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [worries, setWorries] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [selectedUseCase, setSelectedUseCase] = useState("venting");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "conversation");
  const [autoPlayPending, setAutoPlayPending] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkWorryMilestones } = useAchievements(user?.id);
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      setWorries(transcript);
    }
  }, [transcript]);

  // Load available voices - limit to 5 (2 female, 3 male) and load voice preference
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        // Filter for English voices
        const enVoices = allVoices.filter(voice => voice.lang.startsWith('en'));
        
        // Find 2 female voices
        const femaleVoices = enVoices.filter(voice => 
          voice.name.toLowerCase().includes('female') ||
          voice.name.toLowerCase().includes('woman') ||
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('karen') ||
          voice.name.toLowerCase().includes('zira') ||
          voice.name.toLowerCase().includes('victoria')
        ).slice(0, 2);
        
        // Find 3 male voices
        const maleVoices = enVoices.filter(voice => 
          voice.name.toLowerCase().includes('male') ||
          voice.name.toLowerCase().includes('man') ||
          voice.name.toLowerCase().includes('daniel') ||
          voice.name.toLowerCase().includes('alex') ||
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('james')
        ).slice(0, 3);
        
        // Combine and limit to 5 voices total
        const selectedVoices = [...femaleVoices, ...maleVoices].slice(0, 5);
        
        // If we don't have 5 voices, just take the first 5 English voices
        const finalVoices = selectedVoices.length === 5 ? selectedVoices : enVoices.slice(0, 5);
        
        setAvailableVoices(finalVoices);
        
        // Load voice preference from profile or auto-select first voice
        if (user?.id) {
          supabase
            .from('profiles')
            .select('voice_preference')
            .eq('id', user.id)
            .single()
            .then(({ data }) => {
              if (data?.voice_preference) {
                setSelectedVoice(data.voice_preference);
              } else if (finalVoices.length > 0) {
                setSelectedVoice(finalVoices[0].name);
              }
            });
        } else if (finalVoices.length > 0) {
          setSelectedVoice(finalVoices[0].name);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [user]);

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

  const handleTextToSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      });
      return;
    }

    // Stop any ongoing speech
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsSpeaking(false);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Use selected voice
      const voice = availableVoices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = 0.9; // Slightly slower for kids
      utterance.pitch = 1.1; // Slightly higher pitch for friendly tone
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setIsSpeaking(false);
        toast({
          title: "Audio Error",
          description: "Could not play audio. Please try again.",
          variant: "destructive",
        });
      };
      
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsPlayingAudio(false);
      setIsSpeaking(false);
      toast({
        title: "Error",
        description: "Could not generate speech. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsPlayingAudio(false);
    setIsSpeaking(false);
  };

  // Auto-play when suggestion is ready
  useEffect(() => {
    if (autoPlayPending && suggestion && !isLoading) {
      setAutoPlayPending(false);
      handleTextToSpeech(suggestion);
    }
  }, [suggestion, autoPlayPending, isLoading]);

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
        
        // Set auto-play flag
        setAutoPlayPending(true);
        
        // Play musical melody
        const { playMelody } = await import('@/utils/musicalMelody');
        playMelody().catch(() => {
          // Ignore melody errors
        });

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
    { name: "Blue", value: "character-gradient-blue" },
    { name: "Purple", value: "character-gradient-purple" },
    { name: "Pink", value: "character-gradient-pink" },
    { name: "Orange", value: "character-gradient-orange" },
    { name: "Green", value: "character-gradient-green" },
  ];

  const shapes = ["circle", "square"];
  
  const faces = [
    { name: "Happy", value: "happy" },
    { name: "Calm", value: "calm" },
    { name: "Neutral", value: "neutral" },
    { name: "Cheerful", value: "cheerful" },
    { name: "Sad", value: "sad" },
    { name: "Angry", value: "angry" },
  ];

  // Introduction animation screen
  if (showIntro) {
    return (
      <div className={`min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col items-center gap-8">
          {/* Character moving to center */}
          <div className="relative flex flex-col items-center gap-1 transition-all duration-[3000ms] ease-out">
            {/* Head */}
            <div
              className="w-24 h-24 transition-all duration-300 relative flex items-center justify-center"
              style={{
                borderRadius: selectedShape === "circle" ? "50%" : "4px",
                backgroundColor: customColor,
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
              className="w-28 h-32 transition-all duration-300 opacity-90"
              style={{
                borderRadius: selectedShape === "circle" ? "50%" : "4px",
                backgroundColor: customColor,
              }}
            />
            
            {/* Arms */}
            <div className="absolute top-[100px] flex gap-[120px]">
              <div
                className="w-12 h-28 transition-all duration-300 opacity-85"
                style={{
                  borderRadius: selectedShape === "circle" ? "50%" : "4px",
                  backgroundColor: customColor,
                }}
              />
              <div
                className="w-12 h-28 transition-all duration-300 opacity-85"
                style={{
                  borderRadius: selectedShape === "circle" ? "50%" : "4px",
                  backgroundColor: customColor,
                }}
              />
            </div>
            
            {/* Legs */}
            <div className="flex gap-2">
              <div
                className="w-12 h-32 transition-all duration-300 opacity-85"
                style={{
                  borderRadius: selectedShape === "circle" ? "50%" : "4px",
                  backgroundColor: customColor,
                }}
              />
              <div
                className="w-12 h-32 transition-all duration-300 opacity-85"
                style={{
                  borderRadius: selectedShape === "circle" ? "50%" : "4px",
                  backgroundColor: customColor,
                }}
              />
            </div>
          </div>
          
          {/* Introduction text */}
          <div className="text-center space-y-6 animate-fade-in" style={{ animationDelay: "2s" }}>
            <h1 className="text-4xl font-bold gradient-text animate-bounce">
              Hello! I'm {characterName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-md animate-fade-in" style={{ animationDelay: "3s" }}>
              I'm here to listen to your worries and help you feel better.
            </p>
            <p className="text-lg text-muted-foreground max-w-md animate-fade-in" style={{ animationDelay: "5s" }}>
              Whenever you need someone to talk to, I'll be right here for you.
            </p>
            <p className="text-base text-muted-foreground/80 animate-fade-in" style={{ animationDelay: "7s" }}>
              Let's begin...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (characterSaved) {
    return (
      <div className="min-h-screen bg-background px-4 py-12 animate-fade-in transition-opacity duration-1000">
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
              <Button variant="outline" onClick={() => navigate("/profile")}>
                <UserIcon className="w-4 h-4 mr-2" />
                Profile
              </Button>
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
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8">
              <TabsTrigger value="conversation">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="new">Quick Worry</TabsTrigger>
              <TabsTrigger value="wellness">
                <Sparkles className="w-4 h-4 mr-2" />
                Wellness
              </TabsTrigger>
              <TabsTrigger value="history">
                <Clock className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="achievements">
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="conversation">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <ConversationList
                    selectedConversationId={currentConversationId}
                    onSelectConversation={setCurrentConversationId}
                  />
                </div>
                <div className="lg:col-span-2">
                  <ConversationThread
                    conversationId={currentConversationId}
                    useCase={selectedUseCase}
                    onConversationStart={setCurrentConversationId}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="new">
              <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Character Preview */}
            <FriendCharacter
              selectedColor={selectedColor}
              selectedShape={selectedShape}
              selectedFace={selectedFace}
              isSpeaking={isSpeaking}
              characterName={characterName}
            />

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
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Share your thoughts</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isListening ? stopListening : startListening}
                      disabled={isLoading}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2 text-destructive animate-pulse" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={worries}
                    onChange={(e) => setWorries(e.target.value)}
                    placeholder="Type or speak your worries here..."
                    className="min-h-[300px] text-lg resize-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              {suggestion && (
                <div className="bg-card rounded-3xl p-6 shadow-[var(--shadow-soft)] border-2 border-primary/20">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-primary">Your companion suggests:</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="w-[180px] h-9 bg-background">
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          {availableVoices.map((voice) => (
                            <SelectItem key={voice.name} value={voice.name}>
                              {voice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!isPlayingAudio ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTextToSpeech(suggestion)}
                          className="shrink-0"
                        >
                          <Volume2 className="w-5 h-5 text-primary" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleStopSpeech}
                          className="shrink-0"
                        >
                          <VolumeX className="w-5 h-5 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
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

            <TabsContent value="wellness" className="space-y-6 animate-fade-in">
              {/* Streak Tracker - Top Priority */}
              <StreakTracker userId={user?.id} />

              <div className="grid md:grid-cols-2 gap-6">
                {/* Thought Clouds */}
                <ThoughtClouds userId={user?.id} />
                
                {/* Gratitude Jar */}
                <GratitudeJar userId={user?.id} />
              </div>

              {/* Mood Calendar */}
              <MoodCalendar userId={user?.id} />

              {/* Weekly Insights */}
              <WeeklyInsights userId={user?.id} />

              {/* Goals & Habits */}
              <GoalsHabits userId={user?.id} />

              {/* Existing Wellness Activities */}
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div 
                  className="bg-card rounded-3xl p-8 shadow-[var(--shadow-soft)] cursor-pointer hover:shadow-[var(--shadow-glow)] transition-all hover:-translate-y-1 duration-300"
                  onClick={() => navigate("/daily-check-in")}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl animate-float">
                      😊
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Daily Check-In</h3>
                      <p className="text-sm text-muted-foreground">Track your mood</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Start Check-In
                  </Button>
                </div>

                <div 
                  className="bg-card rounded-3xl p-8 shadow-[var(--shadow-soft)] cursor-pointer hover:shadow-[var(--shadow-glow)] transition-all hover:-translate-y-1 duration-300"
                  onClick={() => navigate("/breathing")}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-3xl animate-pulse-glow">
                      🫁
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Breathing Exercises</h3>
                      <p className="text-sm text-muted-foreground">Calm your mind</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full transition-all hover:scale-105">
                    Start Exercise
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
    <div className={`min-h-screen bg-background px-4 py-12 transition-opacity duration-1000 ${fadeOut ? 'opacity-0 animate-fade-out' : 'opacity-100 animate-fade-in'}`}>
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Create Your <span className="gradient-text">Block Friend</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Customize your companion to reflect your unique personality
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Preview */}
          <div className="bg-card rounded-3xl p-12 shadow-[var(--shadow-soft)] flex flex-col items-center justify-center min-h-[400px] gap-6">
            {characterName && (
              <h2 className="text-2xl font-bold gradient-text animate-bounce">{characterName}</h2>
            )}
            <div className="relative flex flex-col items-center gap-1 animate-gentle-sway">
              {/* Head */}
              <div
                className="w-24 h-24 transition-all duration-300 relative flex items-center justify-center animate-color-glow"
                style={{
                  borderRadius: selectedShape === "circle" ? "50%" : "4px",
                  backgroundColor: customColor,
                  color: customColor,
                  boxShadow: `0 0 20px ${customColor}, 0 0 40px ${customColor}40`,
                }}
              >
                {/* Face */}
                <div className="flex flex-col items-center gap-2">
                  {/* Eyes */}
                  <div className="flex gap-3">
                    <div 
                      className="w-3 h-3 bg-foreground rounded-full animate-blink"
                      style={{
                        height: selectedFace === "calm" ? "2px" : 
                                selectedFace === "angry" ? "2px" : "12px",
                        transform: selectedFace === "angry" ? "rotate(-20deg)" : "none",
                      }}
                    />
                    <div 
                      className="w-3 h-3 bg-foreground rounded-full animate-blink"
                      style={{
                        height: selectedFace === "calm" ? "2px" : 
                                selectedFace === "angry" ? "2px" : "12px",
                        transform: selectedFace === "angry" ? "rotate(20deg)" : "none",
                      }}
                    />
                  </div>
                  {/* Mouth */}
                  <div 
                    className="w-8 h-1 bg-foreground rounded-full animate-mouth-talk"
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
                className="w-28 h-32 transition-all duration-300 opacity-90 animate-breath"
                style={{
                  borderRadius: selectedShape === "circle" ? "50%" : "4px",
                  backgroundColor: customColor,
                  boxShadow: `0 4px 20px ${customColor}60`,
                }}
              />
              
              {/* Arms */}
              <div className="absolute top-[100px] flex gap-[120px]">
                <div
                  className="w-12 h-28 transition-all duration-300 opacity-85"
                  style={{
                    borderRadius: selectedShape === "circle" ? "50%" : "4px",
                    backgroundColor: customColor,
                    boxShadow: `0 2px 12px ${customColor}40`,
                  }}
                />
                <div
                  className="w-12 h-28 transition-all duration-300 opacity-85"
                  style={{
                    borderRadius: selectedShape === "circle" ? "50%" : "4px",
                    backgroundColor: customColor,
                    boxShadow: `0 2px 12px ${customColor}40`,
                  }}
                />
              </div>
              
              {/* Legs */}
              <div className="flex gap-2">
                <div
                  className="w-12 h-32 transition-all duration-300 opacity-85"
                  style={{
                    borderRadius: selectedShape === "circle" ? "50%" : "4px",
                    backgroundColor: customColor,
                    boxShadow: `0 2px 12px ${customColor}40`,
                  }}
                />
                <div
                  className="w-12 h-32 transition-all duration-300 opacity-85"
                  style={{
                    borderRadius: selectedShape === "circle" ? "50%" : "4px",
                    backgroundColor: customColor,
                    boxShadow: `0 2px 12px ${customColor}40`,
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
                Name your Friend
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

            {/* Colors */}
            <div>
              <ColorPicker value={customColor} onChange={setCustomColor} />
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
              onClick={() => {
                setFadeOut(true);
                setTimeout(() => {
                  setFadeOut(false);
                  setShowIntro(true);
                  // Start fade out of intro after 8 seconds
                  setTimeout(() => {
                    setFadeOut(true);
                    setTimeout(() => {
                      setCharacterSaved(true);
                      setShowIntro(false);
                      setFadeOut(false);
                    }, 1000); // 1 second fade out
                  }, 8000); // 8 seconds of intro content
                }, 1000); // 1 second fade out
              }}
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

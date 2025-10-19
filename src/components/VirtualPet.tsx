import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Sparkles, Star, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface Pet {
  id: string;
  pet_name: string;
  happiness: number;
  health: number;
  level: number;
  experience: number;
}

interface VirtualPetProps {
  userId?: string;
}

export const VirtualPet = ({ userId }: VirtualPetProps) => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchPet();
    }
  }, [userId]);

  const fetchPet = async () => {
    try {
      const { data, error } = await supabase
        .from('user_pets')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setPet(data);
      if (data) setPetName(data.pet_name);
    } catch (error) {
      console.error('Error fetching pet:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPet = async () => {
    if (!petName.trim() || !userId) return;

    try {
      const { data, error } = await supabase
        .from('user_pets')
        .insert({
          user_id: userId,
          pet_name: petName.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      setPet(data);
      toast({
        title: "Pet Created! 🎉",
        description: `Meet ${petName}! Take care of them by staying active.`,
      });
    } catch (error) {
      console.error('Error creating pet:', error);
    }
  };

  const feedPet = async () => {
    if (!pet || !userId) return;

    const newHappiness = Math.min(100, pet.happiness + 10);
    const newHealth = Math.min(100, pet.health + 5);
    const newExp = pet.experience + 15;
    const newLevel = Math.floor(newExp / 100) + 1;

    try {
      const { error } = await supabase
        .from('user_pets')
        .update({
          happiness: newHappiness,
          health: newHealth,
          experience: newExp,
          level: newLevel,
          last_fed_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
      
      setPet({ ...pet, happiness: newHappiness, health: newHealth, experience: newExp, level: newLevel });
      
      if (newLevel > pet.level) {
        toast({
          title: "Level Up! 🌟",
          description: `${pet.pet_name} is now level ${newLevel}!`,
        });
      } else {
        toast({
          title: "Fed! 🍎",
          description: `${pet.pet_name} is happy!`,
        });
      }
    } catch (error) {
      console.error('Error feeding pet:', error);
    }
  };

  const playWithPet = async () => {
    if (!pet || !userId) return;

    const newHappiness = Math.min(100, pet.happiness + 15);
    const newExp = pet.experience + 20;
    const newLevel = Math.floor(newExp / 100) + 1;

    try {
      const { error } = await supabase
        .from('user_pets')
        .update({
          happiness: newHappiness,
          experience: newExp,
          level: newLevel,
          last_played_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      if (error) throw error;
      
      setPet({ ...pet, happiness: newHappiness, experience: newExp, level: newLevel });
      
      if (newLevel > pet.level) {
        toast({
          title: "Level Up! 🌟",
          description: `${pet.pet_name} is now level ${newLevel}!`,
        });
      } else {
        toast({
          title: "Playtime! 🎮",
          description: `${pet.pet_name} had fun!`,
        });
      }
    } catch (error) {
      console.error('Error playing with pet:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-card rounded-xl" />;
  }

  if (!pet) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🐾</div>
          <h3 className="text-xl font-semibold">Adopt a Wellness Companion!</h3>
          <p className="text-sm text-muted-foreground">
            Your pet grows healthier and happier as you complete wellness activities!
          </p>
          <div className="space-y-3">
            <Input
              placeholder="Name your companion..."
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              maxLength={15}
            />
            <Button onClick={createPet} disabled={!petName.trim()} className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Companion
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const expToNextLevel = 100 - (pet.experience % 100);
  const expProgress = (pet.experience % 100);

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{pet.pet_name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Level {pet.level}</span>
          </div>
        </div>
        <div className="text-6xl animate-gentle-sway">🦄</div>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-pink-500" />
              Happiness
            </span>
            <span className="font-medium">{pet.happiness}%</span>
          </div>
          <Progress value={pet.happiness} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-green-500" />
              Health
            </span>
            <span className="font-medium">{pet.health}%</span>
          </div>
          <Progress value={pet.health} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Experience
            </span>
            <span className="font-medium text-xs">{expToNextLevel} XP to level {pet.level + 1}</span>
          </div>
          <Progress value={expProgress} className="h-2" />
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button onClick={feedPet} variant="outline" className="w-full">
          🍎 Feed
        </Button>
        <Button onClick={playWithPet} variant="outline" className="w-full">
          🎮 Play
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground mt-4">
        Complete wellness activities to earn more XP!
      </p>
    </Card>
  );
};
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Meh, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MoodBlobProps {
  userId?: string;
}

type MoodType = 'happy' | 'sad' | 'neutral' | 'excited' | 'calm';

const moodColors = {
  happy: { from: 'rgb(251, 191, 36)', to: 'rgb(245, 158, 11)' },
  sad: { from: 'rgb(147, 197, 253)', to: 'rgb(96, 165, 250)' },
  neutral: { from: 'rgb(156, 163, 175)', to: 'rgb(107, 114, 128)' },
  excited: { from: 'rgb(251, 113, 133)', to: 'rgb(244, 63, 94)' },
  calm: { from: 'rgb(167, 139, 250)', to: 'rgb(139, 92, 246)' },
};

export const MoodBlob = ({ userId }: MoodBlobProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mood, setMood] = useState<MoodType>('neutral');
  const [isPoking, setIsPoking] = useState(false);
  const [pokePosition, setPokePosition] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const { toast } = useToast();

  // Blob physics state
  const blobRef = useRef({
    points: [] as { x: number; y: number; vx: number; vy: number; angle: number }[],
    centerX: 0,
    centerY: 0,
    radius: 80,
    tension: 0.15,
    damping: 0.85,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    blobRef.current.centerX = rect.width / 2;
    blobRef.current.centerY = rect.height / 2;

    // Initialize blob points - more points for smoother deformation
    const numPoints = 16;
    blobRef.current.points = Array.from({ length: numPoints }, (_, i) => ({
      x: blobRef.current.centerX,
      y: blobRef.current.centerY,
      vx: 0,
      vy: 0,
      angle: (i / numPoints) * Math.PI * 2,
    }));

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const blob = blobRef.current;
      const { centerX, centerY, radius, tension, damping, points } = blob;

      // Update physics
      points.forEach((point, i) => {
        const targetX = centerX + Math.cos(point.angle + Date.now() * 0.0008) * radius;
        const targetY = centerY + Math.sin(point.angle + Date.now() * 0.0008) * radius;

        // Apply drag/poke force - much stronger and wider
        if (isPoking) {
          const dx = point.x - pokePosition.x;
          const dy = point.y - pokePosition.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            // Strong repulsion when far from pointer
            const force = (150 - dist) / 150;
            point.vx += (dx / dist) * force * 12;
            point.vy += (dy / dist) * force * 12;
          }
          
          // Additional attraction for dragging effect when very close
          if (dist < 40) {
            point.vx += -dx * 0.2;
            point.vy += -dy * 0.2;
          }
        }

        // Spring physics - softer for more squish
        point.vx += (targetX - point.x) * tension;
        point.vy += (targetY - point.y) * tension;
        point.vx *= damping;
        point.vy *= damping;

        point.x += point.vx;
        point.y += point.vy;
      });

      // Draw blob
      ctx.beginPath();
      
      // Calculate actual center based on points for better gradient placement
      const avgX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
      const avgY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
      
      const gradient = ctx.createRadialGradient(
        avgX, avgY, 0,
        avgX, avgY, radius * 1.2
      );
      const colors = moodColors[mood];
      gradient.addColorStop(0, colors.from);
      gradient.addColorStop(1, colors.to);
      ctx.fillStyle = gradient;

      // Draw smooth curve through points with more control points for smoother stretching
      points.forEach((point, i) => {
        const nextPoint = points[(i + 1) % points.length];
        const cp1x = point.x + (nextPoint.x - point.x) * 0.3;
        const cp1y = point.y + (nextPoint.y - point.y) * 0.3;
        const cp2x = point.x + (nextPoint.x - point.x) * 0.7;
        const cp2y = point.y + (nextPoint.y - point.y) * 0.7;

        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, nextPoint.x, nextPoint.y);
        }
      });

      ctx.closePath();
      ctx.fill();

      // Add shine effect that follows the blob's deformation
      const shine = ctx.createRadialGradient(
        avgX - radius * 0.3,
        avgY - radius * 0.3,
        0,
        avgX - radius * 0.3,
        avgY - radius * 0.3,
        radius * 0.6
      );
      shine.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      shine.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shine;
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mood, isPoking, pokePosition]);

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0]?.clientX || 0;
      clientY = e.touches[0]?.clientY || 0;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setPokePosition({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
    setIsPoking(true);
  };

  const handleMoodChange = async (newMood: MoodType) => {
    setMood(newMood);
    
    if (userId) {
      try {
        const moodValue = { happy: 5, excited: 4, neutral: 3, calm: 3, sad: 2 }[newMood];
        await supabase.from('daily_check_ins').insert({
          user_id: userId,
          mood: moodValue,
          note: `Blob mood: ${newMood}`,
        });
      } catch (error) {
        console.error('Error saving mood:', error);
      }
    }

    toast({
      title: "Mood updated! 💫",
      description: `Your blob is feeling ${newMood}`,
    });
  };

  const moodButtons = [
    { mood: 'happy' as MoodType, icon: Smile, label: 'Happy' },
    { mood: 'excited' as MoodType, icon: Heart, label: 'Excited' },
    { mood: 'calm' as MoodType, icon: Sparkles, label: 'Calm' },
    { mood: 'neutral' as MoodType, icon: Meh, label: 'Neutral' },
    { mood: 'sad' as MoodType, icon: Frown, label: 'Sad' },
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Mood Blob</h3>
        <p className="text-sm text-muted-foreground">
          Poke, stretch, and squish the blob. Set your mood to change its color!
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-64 rounded-lg cursor-pointer touch-none"
        onMouseDown={handleCanvasInteraction}
        onMouseMove={(e) => e.buttons === 1 && handleCanvasInteraction(e)}
        onMouseUp={() => setIsPoking(false)}
        onMouseLeave={() => setIsPoking(false)}
        onTouchStart={handleCanvasInteraction}
        onTouchMove={handleCanvasInteraction}
        onTouchEnd={() => setIsPoking(false)}
      />

      <div className="grid grid-cols-5 gap-2 mt-4">
        {moodButtons.map(({ mood: m, icon: Icon, label }) => (
          <Button
            key={m}
            variant={mood === m ? "default" : "outline"}
            size="sm"
            onClick={() => handleMoodChange(m)}
            className="flex flex-col h-auto py-2"
          >
            <Icon className="w-4 h-4 mb-1" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>

      <p className="text-xs text-center text-muted-foreground mt-3">
        Click or drag on the blob to interact with it
      </p>
    </Card>
  );
};

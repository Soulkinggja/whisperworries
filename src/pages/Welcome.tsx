import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        <div className="animate-float">
          <Heart className="w-24 h-24 mx-auto text-primary mb-6" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold animate-float">
          <span className="gradient-text animate-gradient">Whisper Worries</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground animate-float" style={{ animationDelay: '0.3s' }}>
          Your safe space for sharing worries and finding peace
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            variant="magical" 
            size="lg"
            className="text-lg"
            onClick={() => navigate("/auth")}
          >
            <Sparkles className="w-5 h-5" />
            Get Started
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg border-2"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Transform your worries into lightness • Track your mood • Build healthy habits
        </p>
      </div>
    </div>
  );
};

export default Welcome;

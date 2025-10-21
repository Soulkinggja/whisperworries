import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Users, BookOpen } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-gradient-calm flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{
        animationDelay: "1s"
      }} />
      </div>

      <div className="container max-w-4xl mx-auto text-center relative z-10 space-y-8 md:space-y-12">
        {/* Title */}
        <div className="space-y-4 md:space-y-6 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold px-2">
            <span className="gradient-text">Whisper Worries</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-2xl mx-auto px-4">
            Transform your worries into lightness through your personal companion
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto px-4 animate-scale-in">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all hover:-translate-y-1 active:scale-95">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-sm md:text-base">Create Character</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Customize your personal companion</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all hover:-translate-y-1 active:scale-95">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2 text-sm md:text-base">Share Worries</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Express your thoughts safely</p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all hover:-translate-y-1 active:scale-95">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2 text-sm md:text-base">Track Progress</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Journal and reflect on growth</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 md:pt-8 animate-fade-in px-4">
          <Button variant="magical" size="lg" className="text-lg md:text-xl px-8 md:px-12 py-5 md:py-6 shadow-xl hover:shadow-2xl active:scale-95 w-full sm:w-auto min-h-[3rem]" onClick={() => window.location.href = '/auth'}>
            <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
            Get Started
          </Button>
          
          <p className="text-xs md:text-sm text-muted-foreground mt-4 md:mt-6">A safe space for your thoughts • Free to use </p>
        </div>

        {/* Copyright */}
        <footer className="mt-8 text-xs text-muted-foreground">
          Copyright © 2025 by Devin McIntosh and Aiden Beckford
        </footer>
      </div>
    </div>;
};
export default Index;
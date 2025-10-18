import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Users, TrendingUp } from "lucide-react";
import heroCharacter from "@/assets/hero-character.png";
import charactersCollection from "@/assets/characters-collection.png";

const Index = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-[var(--shadow-soft)] mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                A Safe Space for Your Thoughts
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="gradient-text">Whisper Worries</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Transform your worries into lightness through customizable block companions 
              that listen, care, and help you heal.
            </p>

            <p className="text-lg text-foreground/80 max-w-xl">
              Create your personal block character, whisper your worries, and join anonymous circles 
              where collective healing happens overnight. Wake up to insights, affirmations, 
              and a lighter heart.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                variant="magical" 
                size="lg"
                className="text-lg"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <Sparkles className="w-5 h-5" />
                Create Your Character
              </Button>
              <Button variant="outline" size="lg" className="text-lg border-2">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Worries Shared</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">5k+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">24hr</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className={`transition-transform duration-500 ${isHovering ? "scale-105" : ""}`}>
              <img 
                src={heroCharacter} 
                alt="Whisper Worries Block Character Avatar" 
                className="w-full h-auto rounded-3xl shadow-[var(--shadow-glow)] animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How <span className="gradient-text">Whisper Worries</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A magical journey from worry to wisdom in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group bg-card rounded-3xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-sunset rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Create Your Character</h3>
              <p className="text-muted-foreground leading-relaxed">
                Craft a unique block character with customizable colors, shapes, and features. 
                Choose styles, expressions, and accessories that bring you comfort and peace.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-card rounded-3xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-weave rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Whisper Your Worries</h3>
              <p className="text-muted-foreground leading-relaxed">
                Confide your worries through voice or text. Your character absorbs them gently, 
                creating a safe space for emotional release without judgment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-card rounded-3xl p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Join Worry Circles</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect anonymously in small circles of 3-5 users. Share insights, receive affirmations, 
                and discover you're not alone in your struggles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collection Preview */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src={charactersCollection} 
                alt="Block Character Avatars Collection" 
                className="w-full h-auto rounded-3xl shadow-[var(--shadow-glow)] animate-pulse-glow"
              />
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Watch Your Characters <span className="gradient-text">Evolve</span>
              </h2>
              
              <p className="text-xl text-muted-foreground">
                As you share and heal, your characters transform. They gain new colors, accessories, 
                and unique features—visual proof of your emotional journey.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Progress Tracking</h4>
                    <p className="text-muted-foreground">
                      Visual timelines show worry dissolution with beautiful animations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Unlock Rewards</h4>
                    <p className="text-muted-foreground">
                      Earn new accessories and patterns as you build consistency
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">AI Insights</h4>
                    <p className="text-muted-foreground">
                      Receive personalized CBT-based reframes and affirmations
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="weave" size="lg" className="text-lg">
                <Sparkles className="w-5 h-5" />
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-sunset">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white">
              Ready to Let Your Worries Float Away?
            </h2>
            
            <p className="text-xl text-white/90">
              Join thousands finding peace through gentle cloud companions 
              designed for today's challenges.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                variant="secondary" 
                size="lg"
                className="text-lg shadow-xl hover:shadow-2xl"
              >
                <Sparkles className="w-5 h-5" />
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                Watch Demo
              </Button>
            </div>

            <p className="text-sm text-white/70">
              No credit card required • Works offline • Data encrypted
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="mb-2">
            Built with ❤️ for the Intellibus Hackathon 2025
          </p>
          <p className="text-sm">
            Kingston, Jamaica • March 15-16, 2025
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

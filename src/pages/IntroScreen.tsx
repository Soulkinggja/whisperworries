import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IntroScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <h1 className="text-6xl md:text-8xl font-bold text-foreground animate-fade-in">
        Whisper Worries
      </h1>
    </div>
  );
};

export default IntroScreen;

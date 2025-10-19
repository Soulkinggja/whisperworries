import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Layout } from "./components/Layout";
import IntroScreen from "./pages/IntroScreen";
import CharacterCustomization from "./pages/CharacterCustomization";
import Auth from "./pages/Auth";
import Journal from "./pages/Journal";
import Friends from "./pages/Friends";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import DailyCheckIn from "./pages/DailyCheckIn";
import BreathingExercises from "./pages/BreathingExercises";
import AvatarDemo from "./pages/AvatarDemo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IntroScreen />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/customize" element={<Layout><CharacterCustomization /></Layout>} />
            <Route path="/journal" element={<Layout><Journal /></Layout>} />
            <Route path="/friends" element={<Layout><Friends /></Layout>} />
            <Route path="/resources" element={<Layout><Resources /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/daily-check-in" element={<Layout><DailyCheckIn /></Layout>} />
            <Route path="/breathing" element={<Layout><BreathingExercises /></Layout>} />
            <Route path="/avatar-demo" element={<Layout><AvatarDemo /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

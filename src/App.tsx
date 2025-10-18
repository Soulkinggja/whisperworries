import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import Journal from "./pages/Journal";
import Breathing from "./pages/Breathing";
import AIAdvice from "./pages/AIAdvice";
import Goals from "./pages/Goals";
import Community from "./pages/Community";
import Resources from "./pages/Resources";
import CharacterCustomization from "./pages/CharacterCustomization";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/breathing" element={<Breathing />} />
          <Route path="/ai-advice" element={<AIAdvice />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/community" element={<Community />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/customize" element={<CharacterCustomization />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

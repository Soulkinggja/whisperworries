import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroScreen from "./pages/IntroScreen";
import CharacterCustomization from "./pages/CharacterCustomization";
import Auth from "./pages/Auth";
import Journal from "./pages/Journal";
import Friends from "./pages/Friends";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IntroScreen />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/customize" element={<CharacterCustomization />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

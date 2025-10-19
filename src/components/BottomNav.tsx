import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Users, BookMarked, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/journal", icon: BookOpen, label: "Journal" },
    { path: "/friends", icon: Users, label: "Friends" },
    { path: "/resources", icon: BookMarked, label: "Resources" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="flex justify-around items-center px-2 sm:px-4 py-2 sm:py-3">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Button
            key={path}
            variant="ghost"
            size="sm"
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-0.5 sm:gap-1 h-auto py-2 px-2 sm:px-3 min-w-[3.5rem] active:scale-95 transition-transform ${
              location.pathname === path
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-[10px] sm:text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

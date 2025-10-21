import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
      <BottomNav />
      <footer className="fixed bottom-0 left-0 right-0 pb-2 text-center text-xs text-muted-foreground bg-background/80 backdrop-blur-sm">
        Copyright © 2025 by Devin McIntosh and Aiden Beckford
      </footer>
    </div>
  );
};

export default Layout;

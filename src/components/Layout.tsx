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
    </div>
  );
};

export default Layout;

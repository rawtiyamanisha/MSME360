import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopNav } from "../components/TopNav";
import { Footer } from "../components/Footer";

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden font-sans">
      
      {/* Platform Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        
        {/* Top Header Navigation */}
        <TopNav onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Content Body Pane */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-6 lg:p-8 flex flex-col relative">
          <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>

        {/* Corporate Footer */}
        <Footer />
        
      </div>
    </div>
  );
};

// components/layout/DashboardLayout.jsx
"use client";
import { useState } from "react";
import TopNavigation from "./TopNavigation";
import LeftSidebar from "./LeftSidebar";
import MobileMenu from "./MobileMenu";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Top Navigation Bar */}
      <TopNavigation onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex pt-16">
        {/* Left Sidebar - Desktop */}
        <LeftSidebar className="hidden lg:flex" />

        {/* Mobile Sidebar Drawer */}
        <MobileMenu
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 min-h-[calc(100vh-4rem)]">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

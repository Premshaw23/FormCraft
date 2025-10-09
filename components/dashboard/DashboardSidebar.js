"use client";

import {
  LayoutDashboard,
  PlusCircle,
  List,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
} from "lucide-react";

export default function DashboardSidebar({ activeView, onViewChange }) {
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      description: "Dashboard home",
    },
    {
      id: "create",
      label: "Create Form",
      icon: PlusCircle,
      description: "Build new form",
    },
    {
      id: "list",
      label: "All Forms",
      icon: List,
      description: "Manage forms",
    },
    {
      id: "check",
      label: "Responses",
      icon: BarChart3,
      description: "View analytics",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 h-[calc(100vh-73px)] sticky top-[73px]">
      <div className="p-6 space-y-6">
        {/* Main Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`}
                />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{item.label}</div>
                  {!isActive && (
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Bottom Actions */}
        <div className="space-y-1">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Help Center</span>
          </button>
        </div>

        {/* Premium Card */}
        <div className="relative bg-gradient-to-br from-purple-800/40 to-pink-800/30 border border-white/20 rounded-2xl p-5 backdrop-blur-lg shadow-xl overflow-hidden">
          {/* Glowy Circle */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full opacity-30 blur-3xl animate-pulse pointer-events-none"></div>

          <div className="flex items-center space-x-3 mb-3 relative z-10">
            {/* Circular Sparkle Container */}
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Go Premium</h3>
              <p className="text-gray-300 text-xs">
                Unlock unlimited forms & advanced analytics
              </p>
            </div>
          </div>

          <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all relative z-10">
            Upgrade Now
          </button>

          {/* Subtle Overlay Glow */}
          <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"></div>
        </div>
      </div>
    </aside>
  );
}

// components/layout/LeftSidebar.jsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Plus,
} from "lucide-react";

export default function LeftSidebar({ className = "" }) {
  const pathname = usePathname();

  // Navigation items configuration
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "My Forms",
      href: "/forms",
      icon: FileText,
      badge: null,
    },
    {
      name: "Responses",
      href: "/responses",
      icon: BarChart3,
      badge: "12", // Example badge
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      badge: null,
    },
  ];

  // Check if link is active
  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-900/95 border-r border-white/10 flex flex-col ${className}`}
    >
      {/* Sidebar content will go here */}
      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        {/* Quick Create Button */}
        <Link
          href="/forms/new"
          className="flex items-center justify-center space-x-2 w-full px-4 py-3 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] transition-all group"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Create New Form</span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all" />
        </Link>

        {/* Navigation Links */}
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
            flex items-center justify-between px-4 py-3 rounded-lg transition-all group
            ${
              active
                ? "bg-purple-500/20 text-purple-400 border-l-4 border-purple-500 pl-3"
                : "text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
            }
          `}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 ${
                      active
                        ? "text-purple-400"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>

                {/* Badge (if exists) */}
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-400 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white/10"></div>

        {/* Secondary Links */}
        <div className="space-y-1">
          <Link
            href="/help"
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help & Support</span>
          </Link>
        </div>
      </nav>
      {/* Bottom Section - Workspace/User Info */}
      <div className="p-4 border-t border-white/10">
        {/* Workspace Card */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-semibold text-sm mb-1">
                Free Plan
              </h4>
              <p className="text-gray-400 text-xs mb-2">2 of 3 forms used</p>
              <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                  style={{ width: "66%" }}
                ></div>
              </div>
              <Link
                href="/pricing"
                className="text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors"
              >
                Upgrade to Pro →
              </Link>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center text-xs text-gray-500">
          FormCraft v1.0.0
        </div>
      </div>
    </aside>
  );
}

// components/layout/MobileMenu.jsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  X,
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  HelpCircle,
  Plus,
  Sparkles,
} from "lucide-react";

export default function MobileMenu({ isOpen, onClose }) {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Forms", href: "/forms", icon: FileText },
    { name: "Responses", href: "/responses", icon: BarChart3, badge: "12" },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      ></div>

      {/* Drawer */}
  <div className="fixed left-0 top-0 bottom-0 w-full max-w-[85vw] sm:max-w-xs bg-slate-900 border-r border-white/10 z-50 lg:hidden transform transition-transform duration-300 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">FormCraft</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Create Button */}
          <Link
            href="/forms/new"
            onClick={onClose}
            className="flex items-center justify-center space-x-2 w-full px-4 py-3 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">Create New Form</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-lg transition-all
                    ${
                      active
                        ? "bg-purple-500/20 text-purple-400 border-l-4 border-purple-500 pl-3"
                        : "text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/20 text-purple-400 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="my-6 border-t border-white/10"></div>

          <Link
            href="/help"
            onClick={onClose}
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help & Support</span>
          </Link>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Sparkles,
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export default function DashboardNavbar({ onSignOut }) {
  const { user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const notifications = [
    { id: 1, title: "New response received", description: "Customer Feedback Survey", time: "5 min ago", unread: true },
    { id: 2, title: "Form published successfully", description: "Event Registration Form", time: "1 hour ago", unread: true },
    { id: 3, title: "Weekly summary available", description: "Check your form analytics", time: "1 day ago", unread: false },
  ];

  return (
    <nav className="bg-slate-900/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white block">
                FormCraft
              </span>
              <span className="text-xs text-gray-400">Dashboard</span>
            </div>
          </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search forms, responses, or settings..."
                className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs text-gray-400 bg-white/5 border border-white/10 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Help */}
            <button className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition hover:scale-105">
              <HelpCircle className="w-5 h-5 text-gray-400" />
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center justify-center transition hover:scale-105"
              >
                <Bell className="w-5 h-5 text-gray-400" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
                  2
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-20">
                  <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">
                      Notifications
                    </h3>
                    <button className="text-xs text-purple-400 hover:text-purple-300">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-slate-700/50 transition-colors cursor-pointer border-b border-slate-700/50 ${
                          n.unread ? "bg-purple-500/5" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {n.unread && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {n.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-slate-700 text-center">
                    <button className="text-xs text-purple-400 hover:text-purple-300">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {getInitials(user?.displayName)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-white">
                    {user?.displayName || "User"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user?.email?.length > 20
                      ? user.email.substring(0, 20) + "..."
                      : user?.email}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-2 z-20">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <div className="text-sm font-medium text-white">
                      {user?.displayName || "User"}
                    </div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                  </div>

                  <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:bg-slate-700 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Dashboard</span>
                  </button>

                  <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:bg-slate-700 transition-colors">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Profile</span>
                  </button>

                  <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:bg-slate-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Settings</span>
                  </button>

                  <div className="border-t border-slate-700 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-400 hover:bg-slate-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

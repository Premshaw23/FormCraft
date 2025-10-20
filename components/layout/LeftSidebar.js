// components/layout/LeftSidebar.jsx
"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  CreditCard,
  Users,
  Bell,
  Zap,
  Crown,
  TrendingUp,
} from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function LeftSidebar({ className = "" }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [formsCount, setFormsCount] = useState(0);
  const [responsesCount, setResponsesCount] = useState(0);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  // Load user data and counts
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Get forms count
        const formsQuery = query(
          collection(db, "forms"),
          where("userId", "==", user.uid)
        );
        const formsSnapshot = await getDocs(formsQuery);
        setFormsCount(formsSnapshot.size);

        // Get responses count (you can adjust this based on your structure)
        let totalResponses = 0;
        formsSnapshot.forEach((doc) => {
          const formData = doc.data();
          totalResponses += formData.responseCount || 0;
        });
        setResponsesCount(totalResponses);

        // Get user plan from Firestore
        const userDoc = await getDocs(
          query(collection(db, "users"), where("__name__", "==", user.uid))
        );
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setCurrentPlan(userData.plan || "free");
        }
      } catch (error) {
        console.error("Error loading sidebar data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Navigation items configuration
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
      description: "Overview & stats",
    },
    {
      name: "My Forms",
      href: "/forms",
      icon: FileText,
      badge: formsCount > 0 ? formsCount : null,
      description: "All your forms",
    },
    {
      name: "Responses",
      href: "/responses",
      icon: BarChart3,
      badge: responsesCount > 0 ? responsesCount : null,
      description: "Form submissions",
    },
    // {
    //   name: "Analytics",
    //   href: "/analytics",
    //   icon: TrendingUp,
    //   badge: null,
    //   description: "Insights & reports",
    //   isPro: true,
    // },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      badge: null,
      description: "App preferences",
    },
  ];

  const bottomItems = [
    {
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
    },
    {
      name: "Help Center",
      href: "/help",
      icon: HelpCircle,
    },
  ];

  // Check if link is active
  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  // Plan limits
  const planLimits = {
    free: { forms: 5, name: "Free" },
    pro: { forms: Infinity, name: "Pro" },
    enterprise: { forms: Infinity, name: "Enterprise" },
  };

  const maxForms = planLimits[currentPlan]?.forms || 5;
  const planName = planLimits[currentPlan]?.name || "Free";
  const formsPercentage =
    maxForms === Infinity ? 0 : (formsCount / maxForms) * 100;
  const isNearLimit = formsPercentage >= 80 && currentPlan === "free";

  return (
    <aside
      className={`fixed left-0 top-16 md:top-16 h-[calc(100vh-4rem)] w-56 md:w-64 bg-slate-900/95 backdrop-blur-lg border-r border-white/10 flex flex-col ${className}`}
    >
      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar">
        {/* Quick Create Button */}
        <Link
          href="/forms/new"
          className={`flex items-center justify-center space-x-2 w-full px-3 py-3 mb-6 rounded-lg transition-all group relative overflow-hidden min-w-0 ${
            currentPlan === "free" && formsCount >= maxForms
              ? "bg-gray-500/20 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02]"
          }`}
          onClick={(e) => {
            if (currentPlan === "free" && formsCount >= maxForms) {
              e.preventDefault();
            }
          }}
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <Plus className="w-5 h-5 relative z-10" />
          <span className="font-semibold relative z-10">Create New Form</span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-1 group-hover:ml-0 transition-all relative z-10" />
        </Link>

        {/* Limit Warning */}
        {currentPlan === "free" && formsCount >= maxForms && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-xs font-medium mb-1">
              Form limit reached
            </p>
            <Link
              href="/pricing"
              className="text-yellow-300 text-xs hover:underline"
            >
              Upgrade to create more →
            </Link>
          </div>
        )}

        {/* Navigation Links */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
            Main Menu
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isLocked = item.isPro && currentPlan === "free";

            return (
              <Link
                key={item.name}
                href={isLocked ? "/pricing" : item.href}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg transition-all group relative
                  ${
                    active
                      ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-purple-400 shadow-lg shadow-purple-500/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                  ${isLocked ? "opacity-60" : ""}
                `}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r"></div>
                )}

                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div
                    className={`relative ${active ? "animate-pulse-slow" : ""}`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-all ${
                        active
                          ? "text-purple-400"
                          : "text-gray-400 group-hover:text-white group-hover:scale-110"
                      }`}
                    />
                    {isLocked && (
                      <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{item.name}</span>
                      {isLocked && (
                        <span className="text-xs text-yellow-500 font-semibold">
                          PRO
                        </span>
                      )}
                    </div>
                    {!active && (
                      <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Badge */}
                {item.badge && !isLocked && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${
                      active
                        ? "bg-purple-500/30 text-purple-300"
                        : "bg-gray-700 text-gray-300 group-hover:bg-purple-500/20 group-hover:text-purple-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-white/10"></div>

        {/* Secondary Links */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
            More
          </div>
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all group ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section - Plan Info */}
      <div className="py-3 px-4 border-t border-white/10 space-y-3">
        {/* Plan Card */}
        <div
          className={`rounded-lg py-2 px-3 relative overflow-hidden ${
            currentPlan === "free"
              ? "bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
              : currentPlan === "pro"
              ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
              : "bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
          }`}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10"></div>

          <div className="relative">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    currentPlan === "free"
                      ? "bg-gradient-to-br from-purple-500 to-pink-500"
                      : currentPlan === "pro"
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                      : "bg-gradient-to-br from-yellow-500 to-orange-500"
                  }`}
                >
                  {currentPlan === "free" ? (
                    <Sparkles className="w-4 h-4 text-white" />
                  ) : currentPlan === "pro" ? (
                    <Zap className="w-4 h-4 text-white" />
                  ) : (
                    <Crown className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">
                    {planName} Plan
                  </h4>
                  {currentPlan !== "free" && (
                    <p className="text-xs text-gray-400">Active</p>
                  )}
                </div>
              </div>
            </div>

            {currentPlan === "free" && (
              <>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Forms</span>
                    <span
                      className={`font-medium ${
                        isNearLimit ? "text-yellow-400" : "text-white"
                      }`}
                    >
                      {loading ? "..." : `${formsCount} of ${maxForms}`}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        isNearLimit
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                          : "bg-gradient-to-r from-purple-500 to-pink-500"
                      }`}
                      style={{ width: `${Math.min(formsPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <Link
                  href="/pricing"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all group"
                >
                  <Zap className="w-4 h-4" />
                  Upgrade to Pro
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}

            {currentPlan !== "free" && (
              <Link
                href="/billing"
                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              >
                Manage subscription
                <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">FormCraft v1.0.0</p>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </aside>
  );
}

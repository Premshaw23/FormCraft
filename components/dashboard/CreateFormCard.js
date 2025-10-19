// components/dashboard/CreateFormCard.jsx
"use client";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreateFormCard() {
  return (
    <Link
      href="/forms/new"
      className="group relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-dashed border-purple-500/30 rounded-xl p-8 hover:border-purple-500/60 hover:bg-purple-500/20 transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] overflow-hidden"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Floating Sparkles */}
      <Sparkles className="absolute top-4 right-4 w-5 h-5 text-purple-400/50 animate-pulse" />
      <Sparkles className="absolute bottom-4 left-4 w-4 h-4 text-pink-400/50 animate-pulse delay-300" />

      {/* Plus Icon */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Plus className="w-8 h-8 text-white" />
      </div>

      {/* Text */}
      <h3 className="text-xl font-bold text-white mb-2 text-center">
        Create New Form
      </h3>
      <p className="text-gray-400 text-sm text-center max-w-xs">
        Start building a beautiful form in seconds
      </p>

      {/* Hover Indicator */}
      <div className="mt-4 flex items-center space-x-2 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-sm font-medium">Get started</span>
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}

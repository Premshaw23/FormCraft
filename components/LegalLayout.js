"use client"
import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  FileText,
  Info,
  ChevronRight,
  Mail,
  ArrowLeft,
  Check,
  Lock,
  Globe,
  Scale,
  UserCheck,
  Clock,
  AlertCircle,
} from "lucide-react";

// Legal Layout Component
const LegalLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div
          className="absolute w-72 h-72 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl bottom-20 right-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">FormCraft</span>
            </div>
            <a
              href="/"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              {title}
            </h1>
            <div className="prose prose-invert prose-lg max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} FormCraft. All rights reserved.
        </div>
      </footer>

      <style jsx>{`
        .prose h2 {
          color: white;
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(168, 85, 247, 0.3);
        }
        .prose h3 {
          color: #e0e7ff;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose p {
          color: #d1d5db;
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        .prose ul {
          color: #d1d5db;
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }
        .prose strong {
          color: white;
          font-weight: 600;
        }
        .prose a {
          color: #c084fc;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .prose a:hover {
          color: #e879f9;
        }
      `}</style>
    </div>
  );
};

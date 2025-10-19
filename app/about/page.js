"use client"
import React from "react";
import {
  Sparkles,
  Shield,
  ArrowLeft,
  Check,
  Mail,
  Info,
  UserCheck,
  ChevronRight,
} from "lucide-react";

const Section = ({ title, icon: Icon, children }) => (
  <div className="space-y-3">
    <h2 className="text-2xl font-bold text-white flex items-center border-b-2 border-purple-500/30 pb-3">
      {Icon && (
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
          <Icon className="w-5 h-5 text-white" />
        </div>
      )}
      {title}
    </h2>
    <div className="pl-0 md:pl-11">{children}</div>
  </div>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div
          className="absolute w-72 h-72 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl bottom-20 right-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
              animation: `float ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
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
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                About FormCraft
              </h1>
            </div>

            <div className="space-y-6 text-gray-300">
              <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl border border-orange-500/20">
                <p className="text-lg leading-relaxed">
                  FormCraft is a privacy-first form platform built to let teams
                  build, share, and analyze forms quickly. We focus on
                  performance, developer experience, and giving users clear
                  control of their data.
                </p>
              </div>

              <Section title="Our Mission" icon={Sparkles}>
                <p>
                  To empower organizations and individuals with tools that make
                  data collection simple, secure, and insightful. We believe
                  forms should be beautiful, functional, and respect user
                  privacy.
                </p>
              </Section>

              <Section title="Our Values" icon={Check}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        Privacy by Design
                      </h3>
                    </div>
                    <p>
                      We minimize data collection and keep defaults
                      conservative. Your data is yours, always.
                    </p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        Developer-Centric
                      </h3>
                    </div>
                    <p>
                      Clean APIs, predictable behavior, and excellent
                      documentation for developers.
                    </p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-green-500/30 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        Reliability
                      </h3>
                    </div>
                    <p>
                      Fast response times, 99.9% uptime, and robust
                      infrastructure you can depend on.
                    </p>
                  </div>

                  <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-orange-500/30 transition-all">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        User-Focused
                      </h3>
                    </div>
                    <p>
                      Beautiful interfaces, intuitive workflows, and features
                      that solve real problems.
                    </p>
                  </div>
                </div>
              </Section>

              <Section title="Why We Built This" icon={Sparkles}>
                <p className="mb-4">
                  Traditional form builders are either too complex or too
                  limited. We saw a gap in the market for a tool that is:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    <strong>Fast and modern</strong> — Built with the latest web
                    technologies for instant interactions
                  </li>
                  <li>
                    <strong>Privacy-respecting</strong> — No tracking, no
                    selling data, transparent practices
                  </li>
                  <li>
                    <strong>Powerful yet simple</strong> — Advanced features
                    without overwhelming complexity
                  </li>
                  <li>
                    <strong>Beautiful</strong> — Forms that people actually want
                    to fill out
                  </li>
                </ul>
              </Section>

              <Section title="Our Technology" icon={Sparkles}>
                <p className="mb-4">
                  FormCraft is built with cutting-edge technology:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Next.js 15",
                    "React 19",
                    "Firebase",
                    "Tailwind CSS",
                    "TypeScript",
                    "Vercel",
                    "Cloud Storage",
                    "Real-time DB",
                  ].map((tech, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20 text-center font-medium"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Get in Touch" icon={Mail}>
                <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
                  <p className="mb-4">
                    We'd love to hear from you! Whether you have questions,
                    feedback, or just want to say hello:
                  </p>
                  <div className="space-y-3">
                    <a
                      href="mailto:shawprem217@gmail.com"
                      className="flex items-center space-x-3 text-purple-400 hover:text-purple-300 transition group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Email Us</div>
                        <div className="text-sm text-gray-400">
                          shawprem217@gmail.com
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </Section>

              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl border border-purple-500/20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Ready to get started?
                    </h3>
                    <p className="text-gray-300">
                      Join thousands of teams building better forms with
                      FormCraft.
                    </p>
                  </div>
                  <a
                    href="/"
                    className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>Get Started</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
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

      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

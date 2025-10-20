"use client"

import React from "react";
import {
  Sparkles,
  Shield,
  FileText,
  ArrowLeft,
  Check,
  Scale,
  Globe,
  Mail,
  Clock,
  AlertCircle,
  UserCheck,
} from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
  <div className="absolute w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div
          className="absolute w-48 h-48 md:w-72 md:h-72 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl bottom-20 right-10 animate-pulse"
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Terms of Service
              </h1>
            </div>
            <p className="text-purple-300 mb-8 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Last updated: <strong className="ml-2">October 19, 2025</strong>
            </p>

            <div className="space-y-6 text-gray-300">
              <Section title="1. Agreement to Terms" icon={Check}>
                <p>
                  These Terms govern your use of FormCraft. By using the service
                  you agree to these Terms and our Privacy Policy. If you do not
                  agree, do not use the service.
                </p>
              </Section>

              <Section title="2. Accounts" icon={UserCheck}>
                <p>
                  You must provide accurate information and are responsible for
                  activity on your account. Keep your password secure and notify
                  us immediately of any unauthorized access.
                </p>
              </Section>

              <Section title="3. Acceptable Use" icon={Shield}>
                <p>
                  You may not use the service to collect or distribute illegal
                  content, spam, infringing content, or to violate others'
                  rights. You're responsible for content you create and collect
                  through forms.
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>No malicious code, viruses, or harmful software</li>
                  <li>No harassment, abuse, or hate speech</li>
                  <li>No impersonation or fraudulent activities</li>
                  <li>No unauthorized data collection or scraping</li>
                </ul>
              </Section>

              <Section title="4. Ownership & License" icon={FileText}>
                <p>
                  You retain ownership of content and form responses you upload
                  or collect. By using the service you grant us a limited
                  license to store and display that content as required to
                  provide the service.
                </p>
              </Section>

              <Section title="5. Payments & Refunds" icon={Check}>
                <p>
                  Paid plans are billed monthly or annually. Subscriptions
                  automatically renew unless canceled. Refunds are available
                  within 14 days of purchase for annual plans, subject to our
                  refund policy.
                </p>
              </Section>

              <Section title="6. Termination" icon={AlertCircle}>
                <p>
                  We may suspend or terminate accounts for breach of Terms. You
                  may delete your account anytime; deletion may not remove
                  copies retained for legal compliance or backups for a limited
                  period (up to 30 days).
                </p>
              </Section>

              <Section
                title="7. Disclaimers & Limits of Liability"
                icon={Scale}
              >
                <p>
                  Services are provided "as is" without warranties. We limit
                  liability to direct damages up to the amount you paid in the
                  last 12 months. We're not liable for indirect, incidental, or
                  consequential damages.
                </p>
              </Section>

              <Section title="8. Governing Law" icon={Globe}>
                <p>
                  These Terms are governed by the laws of India. Disputes will
                  be resolved in courts of Bhopal, India. Both parties waive
                  trial by jury.
                </p>
              </Section>

              <Section title="9. Changes to Terms" icon={Clock}>
                <p>
                  We may modify these Terms; we will notify users of material
                  changes via email or in-app notification at least 30 days
                  before they take effect.
                </p>
              </Section>

              <Section title="10. Contact" icon={Mail}>
                <p>
                  For legal inquiries, email:{" "}
                  <a
                    href="mailto:shawprem217@gmail.com"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    shawprem217@gmail.com
                  </a>
                </p>
              </Section>

              <div className="mt-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <p className="text-sm text-purple-300 flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Note: This is a legal template. For production use, please
                    consult with a qualified attorney to ensure compliance with
                    your jurisdiction.
                  </span>
                </p>
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

// Section Component
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

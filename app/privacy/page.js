"use client";

import React from "react";
import {
  Sparkles,
  Shield,
  FileText,
  ArrowLeft,
  Check,
  Globe,
  Mail,
  Clock,
  Lock,
  UserCheck,
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

export default function PrivacyPage() {
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
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Privacy Policy
              </h1>
            </div>
            <p className="text-purple-300 mb-8 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Last updated: <strong className="ml-2">October 19, 2025</strong>
            </p>

            <div className="space-y-6 text-gray-300">
              <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2" />
                  TL;DR
                </h2>
                <p className="text-gray-300">
                  We collect the minimum personal data necessary to operate
                  FormCraft (account email, profile). We do not sell your data.
                  You can request data export or deletion anytime.
                </p>
              </div>

              <Section title="1. What We Collect" icon={FileText}>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Account Information
                </h3>
                <p>
                  Email address, display name, avatar (optional), and
                  authentication metadata from your sign-in provider (Google,
                  email/password).
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">
                  Form Responses
                </h3>
                <p>
                  When users submit forms, responses are stored for the form
                  owner to review. Owners control retention and export via the
                  dashboard.
                </p>

                <h3 className="text-xl font-semibold text-white mb-2 mt-4">
                  Metadata
                </h3>
                <p>
                  Timestamps, IP addresses (limited retention), user agent
                  strings, and basic device info for security and abuse
                  detection.
                </p>
              </Section>

              <Section title="2. How We Use Data" icon={Check}>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    Provide and improve our services (auth, forms, analytics)
                  </li>
                  <li>Security and abuse prevention</li>
                  <li>Customer support and communications</li>
                  <li>Legal obligations and responding to lawful requests</li>
                  <li>Analytics to understand usage patterns (anonymized)</li>
                </ul>
              </Section>

              <Section title="3. Data Sharing & Third Parties" icon={Globe}>
                <p>
                  We may use subprocessors for email delivery, analytics, and
                  hosting (e.g., Vercel, Firebase). Subprocessors are
                  contractually required to protect data. We never sell your
                  personal data to third parties.
                </p>
              </Section>

              <Section title="4. Data Retention" icon={Clock}>
                <p>
                  Account data is kept until you delete your account. Form
                  responses are retained until the owner deletes them or a
                  retention policy applies. Deleted data is permanently removed
                  within 30 days.
                </p>
              </Section>

              <Section title="5. Security" icon={Lock}>
                <p>
                  We apply industry-standard controls: TLS encryption in
                  transit, encrypted storage for sensitive data, regular
                  security audits, and access controls. No system is perfect —
                  report security incidents to{" "}
                  <a
                    href="mailto:shawprem217@gmail.com"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    shawprem217@gmail.com
                  </a>
                  .
                </p>
              </Section>

              <Section title="6. Your Rights" icon={UserCheck}>
                <p className="mb-2">
                  Depending on your jurisdiction, you can request:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>
                    <strong>Access</strong> — a copy of personal data we hold
                    about you
                  </li>
                  <li>
                    <strong>Rectification</strong> — correct inaccurate
                    information
                  </li>
                  <li>
                    <strong>Deletion</strong> — erase your personal data
                  </li>
                  <li>
                    <strong>Restriction / objection</strong> — limit or object
                    to certain processing
                  </li>
                  <li>
                    <strong>Data portability</strong> — export your data in a
                    machine-readable format
                  </li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, contact{" "}
                  <a
                    href="mailto:shawprem217@gmail.com"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    shawprem217@gmail.com
                  </a>
                  . We'll verify your identity before responding.
                </p>
              </Section>

              <Section title="7. International Transfers" icon={Globe}>
                <p>
                  Data may be processed or stored outside your country where our
                  services or subprocessors operate. We use standard contractual
                  clauses where required by law.
                </p>
              </Section>

              <Section title="8. Children's Privacy" icon={Shield}>
                <p>
                  We do not knowingly collect personal data from children under
                  16. If you believe we have such data, contact us immediately
                  for removal.
                </p>
              </Section>

              <Section title="9. Changes to This Policy" icon={Clock}>
                <p>
                  We'll post updates here with a new "Last updated" date.
                  Significant changes will be communicated through email when
                  feasible.
                </p>
              </Section>

              <Section title="10. Contact" icon={Mail}>
                <p>
                  Privacy inquiries:{" "}
                  <a
                    href="mailto:shawprem217@gmail.com"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    shawprem217@gmail.com
                  </a>
                </p>
              </Section>
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

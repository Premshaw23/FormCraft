"use client";

import React from "react";
import {
  Sparkles,
  Shield,
  ArrowLeft,
  Scale,
  Globe,
  Mail,
  Clock,
  Lock,
  UserCheck,
  AlertCircle,
  Building,
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

export default function GDPRPage() {
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                GDPR & Your Rights
              </h1>
            </div>
            <p className="text-purple-300 mb-8 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Last updated: <strong className="ml-2">October 19, 2025</strong>
            </p>

            <div className="space-y-6 text-gray-300">
              <div className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
                <h2 className="text-xl font-semibold text-white mb-2">Scope</h2>
                <p>
                  This page summarizes how we comply with the EU General Data
                  Protection Regulation (GDPR) for residents of the European
                  Economic Area (EEA).
                </p>
              </div>

              <Section title="1. Data Controller" icon={Building}>
                <p>
                  Data controller: FormCraft (legal entity address to be
                  specified).
                  <br />
                  Contact:{" "}
                  <a
                    href="mailto:shawprem217@gmail.com"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    shawprem217@gmail.com
                  </a>
                </p>
              </Section>

              <Section title="2. Legal Bases for Processing" icon={Scale}>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    <strong>Performance of a contract</strong> — to provide the
                    service you signed up for (accounts, forms, analytics)
                  </li>
                  <li>
                    <strong>Legal obligation</strong> — where required by law
                    (e.g., tax records, legal requests)
                  </li>
                  <li>
                    <strong>Legitimate interests</strong> — fraud detection,
                    security, and service improvement (balanced against
                    individual rights)
                  </li>
                  <li>
                    <strong>Consent</strong> — where explicitly requested (rare
                    for core product features, used for marketing)
                  </li>
                </ul>
              </Section>

              <Section title="3. Rights of Data Subjects" icon={UserCheck}>
                <p className="mb-2">
                  EEA residents may exercise the following rights:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-1">
                      Right to Access
                    </h4>
                    <p className="text-sm">
                      Request a copy of your personal data
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-1">
                      Right to Rectification
                    </h4>
                    <p className="text-sm">Correct inaccurate data</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-1">
                      Right to Erasure
                    </h4>
                    <p className="text-sm">
                      Delete personal data (with legal caveats)
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-1">
                      Right to Restrict Processing
                    </h4>
                    <p className="text-sm">Limit how we process your data</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-1">
                      Right to Data Portability
                    </h4>
                    <p className="text-sm">
                      Export data in machine-readable format
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <h4 className="font-semibold text-white mb-1">
                      Right to Object
                    </h4>
                    <p className="text-sm">
                      Object to processing based on legitimate interests
                    </p>
                  </div>
                </div>
              </Section>

              <Section title="4. How to Exercise Your Rights" icon={Mail}>
                <p>
                  Contact{" "}
                  <a
                    href="mailto:shawprem217@gmail.com"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    shawprem217@gmail.com
                  </a>{" "}
                  with a clear subject line (e.g., "GDPR data access request")
                  and include proof of identity. We'll respond within one month,
                  subject to verification and lawful extensions.
                </p>
              </Section>

              <Section title="5. Data Protection Measures" icon={Shield}>
                <p>
                  We use appropriate technical and organisational measures to
                  keep personal data secure:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Encryption at rest and in transit (TLS/SSL)</li>
                  <li>Role-based access controls and authentication</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Incident response procedures</li>
                  <li>Data minimization and purpose limitation</li>
                </ul>
              </Section>

              <Section title="6. Data Transfers Outside the EEA" icon={Globe}>
                <p>
                  Where we transfer personal data outside the EEA, we rely on
                  adequacy decisions, standard contractual clauses (SCCs), or
                  other lawful transfer mechanisms approved by the European
                  Commission.
                </p>
              </Section>

              <Section title="7. Supervisory Authority" icon={AlertCircle}>
                <p>
                  If you're unhappy with our response, you may lodge a complaint
                  with your local data protection authority in the EU/EEA. You
                  can find your authority at{" "}
                  <a
                    href="https://edpb.europa.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    edpb.europa.eu
                  </a>
                  .
                </p>
              </Section>

              <div className="mt-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <p className="text-sm text-purple-300 flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>
                    Note: This GDPR summary simplifies obligations. For
                    production use, consult a qualified privacy lawyer and adapt
                    wording to your exact processing activities.
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

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  ArrowRight,
  HelpCircle,
  Users,
  BarChart3,
  Shield,
  Mail,
  Infinity,
} from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or annual

  const plans = [
    {
      name: "Free",
      icon: Sparkles,
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started",
      features: [
        { text: "3 forms", included: true },
        { text: "100 responses per month", included: true },
        { text: "Basic form fields", included: true },
        { text: "Email notifications", included: true },
        { text: "7-day data retention", included: true },
        { text: "FormCraft branding", included: true },
        { text: "Custom domains", included: false },
        { text: "File uploads", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Team collaboration", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Get Started",
      popular: false,
      current: true,
    },
    {
      name: "Pro",
      icon: Zap,
      price: { monthly: 19, annual: 190 },
      description: "For professionals and growing teams",
      features: [
        { text: "Unlimited forms", included: true },
        { text: "10,000 responses per month", included: true },
        { text: "All form field types", included: true },
        { text: "Custom domains", included: true },
        { text: "File uploads (100MB)", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Remove FormCraft branding", included: true },
        { text: "Email & Slack notifications", included: true },
        { text: "90-day data retention", included: true },
        { text: "Team collaboration (5 members)", included: true },
        { text: "Priority email support", included: true },
      ],
      cta: "Upgrade to Pro",
      popular: true,
      current: false,
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: { monthly: 99, annual: 990 },
      description: "For large organizations",
      features: [
        { text: "Unlimited everything", included: true },
        { text: "Unlimited responses", included: true },
        { text: "Custom integrations", included: true },
        { text: "Unlimited custom domains", included: true },
        { text: "File uploads (1GB)", included: true },
        { text: "Advanced analytics & exports", included: true },
        { text: "White-label solution", included: true },
        { text: "API access", included: true },
        { text: "Unlimited data retention", included: true },
        { text: "Unlimited team members", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "SLA guarantee", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
      current: false,
    },
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer:
        "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.",
    },
    {
      question: "What happens if I exceed my response limit?",
      answer:
        "Your forms will continue to work, but you'll need to upgrade to access new responses. We'll notify you before you reach your limit.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Absolutely! There are no long-term contracts. You can cancel your subscription at any time from your billing settings.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.",
    },
    {
      question: "Is there a discount for annual billing?",
      answer:
        "Yes! Annual billing gives you 2 months free compared to monthly billing.",
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const handlePlanSelect = (plan) => {
    if (plan.name === "Free") {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } else if (plan.name === "Enterprise") {
      window.location.href = "mailto:sales@formcraft.com";
    } else {
      if (user) {
        router.push("/billing");
      } else {
        router.push("/login");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FormCraft</span>
            </div>
            <button
              onClick={() => router.push(user ? "/dashboard" : "/")}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              {user ? "Dashboard" : "Back to Home"}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Choose the perfect plan for your needs. Always know what you'll pay.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-6 py-2 rounded-md font-medium transition-all relative ${
                billingCycle === "annual"
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price =
              billingCycle === "monthly"
                ? plan.price.monthly
                : plan.price.annual;
            const monthlyPrice = billingCycle === "annual" ? price / 12 : price;

            return (
              <div
                key={index}
                className={`relative bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-8 ${
                  plan.popular
                    ? "border-purple-500 shadow-2xl shadow-purple-500/20 scale-105"
                    : "border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Current Plan
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-4">
                    <Icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">
                      ${Math.floor(monthlyPrice)}
                    </span>
                    <span className="text-gray-400 mb-2">/month</span>
                  </div>
                  {billingCycle === "annual" && price > 0 && (
                    <p className="text-sm text-gray-400">
                      Billed ${price} annually
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  disabled={plan.current}
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                    plan.current
                      ? "bg-white/5 text-gray-400 cursor-not-allowed"
                      : plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {plan.current ? "Current Plan" : plan.cta}
                </button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            All Plans Include
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Security First",
                description: "Enterprise-grade security for all plans",
              },
              {
                icon: BarChart3,
                title: "Analytics",
                description: "Track form performance and responses",
              },
              {
                icon: Mail,
                title: "Notifications",
                description: "Get instant alerts for new submissions",
              },
              {
                icon: Users,
                title: "Collaboration",
                description: "Work together with your team",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg font-semibold text-white pr-4">
                    {faq.question}
                  </span>
                  <HelpCircle
                    className={`w-5 h-5 text-purple-400 flex-shrink-0 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Our team is here to help you find the perfect plan for your needs.
              Get in touch and we'll answer all your questions.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() =>
                  (window.location.href = "mailto:support@formcraft.com")
                }
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
              >
                Contact Support
              </button>
              <button
                onClick={() => router.push(user ? "/dashboard" : "/login")}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

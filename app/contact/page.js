"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Twitter,
  Linkedin,
  Facebook,
  Building,
  Users,
  Sparkles,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { useAuth } from "@/context/AuthContext";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const { user, loading, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        { ...formData },
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID
      );

      setSubmitStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully.",
      });
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Sorry, something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "shawprem217@gmail.com",
      href: "mailto:shawprem217@gmail.com",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 81004 839XX",
      href: "tel:+918100483900",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Bhopal, India",
      href: "#",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const socialLinks = [
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/learnova",
      color: "hover:text-blue-400",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: "https://linkedin.com/company/learnova",
      color: "hover:text-blue-600",
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://facebook.com/learnova",
      color: "hover:text-blue-500",
    },
  ];

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div
            className="absolute w-72 h-72 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl bottom-20 right-10 animate-pulse"
            style={{ animationDelay: "2s" }}
          />

          {/* Floating particles */}
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
      </div>

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

      <div className="min-h-screen relative z-50">
        {/* Navigation */}
        <nav className="fixed top-0 w-full left-0 right-0 z-50 transition-all duration-200 bg-slate-900/10 backdrop-blur-lg shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">FormCraft</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300"
                    >
                      Go to Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="px-6 py-2 bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-all duration-300"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white p-2"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-slate-900/95 backdrop-blur-lg p-4 space-y-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-6 py-2 bg-white/10 text-white rounded-full border border-white/20 flex items-center justify-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="block w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm mb-6">
              <MessageCircle className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-purple-200 font-medium">Get in Touch</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Contact{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Us
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Ready to transform your educational institution? Let&apos;s
              discuss how FormCraft can streamline your operations and enhance
              student success.
            </p>
          </div>
        </section>

        <div className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div className="relative">
                <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-500">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Send us a Message
                    </h2>
                    <p className="text-gray-400">
                      Fill out the form below and our team will get back to you
                      within 24 hours.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-white font-medium">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-white font-medium">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="you@example.com"
                          required
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-white font-medium">
                        Institution/Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Your institution or company name"
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-white font-medium">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Tell us about your needs and how we can help..."
                        required
                        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500/50 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Submit Status */}
                    {submitStatus && (
                      <div
                        className={`p-4 rounded-xl flex items-center gap-3 ${
                          submitStatus.type === "success"
                            ? "bg-green-500/20 border border-green-500/30 text-green-300"
                            : "bg-red-500/20 border border-red-500/30 text-red-300"
                        }`}
                      >
                        {submitStatus.type === "success" ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                        <span>{submitStatus.message}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Contact Details */}
                <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Get in Touch
                  </h3>

                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="group flex items-start gap-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <info.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{info.label}</p>
                          <a
                            href={info.href}
                            className="text-white text-lg font-medium hover:text-purple-400 transition-colors duration-300"
                          >
                            {info.value}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Hours */}
                <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Business Hours
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Monday - Friday</span>
                      <span className="text-white font-medium">
                        9:00 AM - 6:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Saturday</span>
                      <span className="text-white font-medium">
                        10:00 AM - 4:00 PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Sunday</span>
                      <span className="text-gray-400">Closed</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <p className="text-purple-300 text-sm flex items-center">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      For urgent support, we respond to emails within 2 hours
                      during business days.
                    </p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Follow Us
                  </h3>

                  <div className="flex gap-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:border-current`}
                      >
                        <social.icon className="w-6 h-6" />
                      </a>
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm mt-4">
                    Stay updated with our latest features and educational
                    insights.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

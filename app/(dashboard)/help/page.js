// app/(dashboard)/help/page.js
"use client";
import { useState } from "react";
import {
  Search,
  BookOpen,
  MessageCircle,
  Mail,
  Video,
  FileText,
  Zap,
  Shield,
  Settings,
  Users,
  ChevronRight,
  ExternalLink,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import emailjs from "@emailjs/browser";


export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
   const { user, loading, signOut } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

  // Help categories
  const categories = [
    {
      icon: Zap,
      title: "Getting Started",
      description: "Learn the basics of FormCraft",
      color: "from-yellow-500 to-orange-500",
      articles: [
        "Creating your first form",
        "Understanding form fields",
        "Publishing and sharing forms",
        "Managing responses",
      ],
    },
    {
      icon: FileText,
      title: "Form Builder",
      description: "Master form creation",
      color: "from-blue-500 to-cyan-500",
      articles: [
        "Available field types",
        "Field validation rules",
        "Conditional logic",
        "Multi-page forms",
      ],
    },
    {
      icon: Settings,
      title: "Settings & Customization",
      description: "Customize your forms",
      color: "from-purple-500 to-pink-500",
      articles: [
        "Theme customization",
        "Access control settings",
        "Email notifications",
        "Custom domains",
      ],
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Keep your data safe",
      color: "from-green-500 to-emerald-500",
      articles: [
        "Data encryption",
        "GDPR compliance",
        "User authentication",
        "Data export and deletion",
      ],
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Work with your team",
      color: "from-red-500 to-rose-500",
      articles: [
        "Inviting team members",
        "Permission levels",
        "Sharing forms internally",
        "Workspace management",
      ],
    },
    {
      icon: MessageCircle,
      title: "Integrations",
      description: "Connect with other tools",
      color: "from-indigo-500 to-purple-500",
      articles: [
        "Webhooks setup",
        "API documentation",
        "Third-party integrations",
        "Export options",
      ],
    },
  ];

  // Quick actions
  const quickActions = [
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      href: "#tutorials",
      color: "bg-red-500",
    },
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Browse full documentation",
      href: "#docs",
      color: "bg-blue-500",
    },
    {
      icon: MessageCircle,
      title: "Community Forum",
      description: "Ask questions and share ideas",
      href: "#forum",
      color: "bg-green-500",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help from our team",
      href: "#contact",
      color: "bg-purple-500",
    },
  ];

  // Popular articles
  const popularArticles = [
    { title: "How to create your first form", views: "1.2k", time: "5 min" },
    { title: "Setting up email notifications", views: "890", time: "3 min" },
    { title: "Understanding response analytics", views: "756", time: "7 min" },
    { title: "Exporting data to CSV", views: "654", time: "2 min" },
    { title: "Custom form themes guide", views: "543", time: "8 min" },
  ];

 const handleContactSubmit = async (e) => {
   e.preventDefault();
   setIsSubmitting(true);
   setSubmitStatus(null);

   try {
     await emailjs.send(
       process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
       process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
       {
         subject: contactForm.subject,
         message: contactForm.message,
         email: user?.email || "anonymous@formcraft.app",
         name: user?.displayName || "Anonymous User",
       },
       process.env.NEXT_PUBLIC_EMAILJS_USER_ID
     );

     setSubmitStatus({
       type: "success",
       message: "Thank you! Your message has been sent successfully.",
     });
     setContactForm({ subject: "", message: "" });
   } catch (error) {
     console.error("EmailJS Error:", error);
     setSubmitStatus({
       type: "error",
       message: "Sorry, something went wrong. Please try again later.",
     });
   } finally {
     setIsSubmitting(false);
   }
 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          How can we help you?
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Search our help center or browse categories below
        </p>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles, guides, tutorials..."
            className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <a
                key={index}
                href={action.href}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all group"
              >
                <div
                  className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </a>
            );
          })}
        </div>
      </div>

      {/* Help Categories */}
      <div className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <a
                        href="#"
                        className="flex items-center justify-between text-gray-300 hover:text-purple-400 transition-colors group"
                      >
                        <span className="text-sm">{article}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium mt-4 transition-colors"
                >
                  View all articles
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Articles List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">
              Popular Articles
            </h2>
            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex items-center justify-between bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-purple-500/50 transition-all group"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors truncate">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">
                          {article.views} views
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">
                          {article.time} read
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Contact Support
            </h2>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-6">
                Can't find what you're looking for? Send us a message and we'll
                get back to you within 24 hours.
              </p>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    placeholder="What do you need help with?"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    placeholder="Describe your issue or question..."
                    rows={5}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
              {submitStatus && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}
            </div>

            {/* Additional Help */}
            <div className="mt-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">
                Need immediate help?
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Join our community chat for instant answers from other FormCraft
                users.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Join Community Chat
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "How do I create my first form?",
              a: "Click the 'Create New Form' button on your dashboard, choose a template or start blank, then add fields using our drag-and-drop builder.",
            },
            {
              q: "Can I customize the look of my forms?",
              a: "Yes! Use the theme editor in the form builder to customize colors, fonts, backgrounds, and more to match your brand.",
            },
            {
              q: "How do I share my form?",
              a: "Once published, you'll get a unique URL to share. You can also embed forms on your website or share via QR code.",
            },
            {
              q: "Are responses stored securely?",
              a: "Absolutely. All data is encrypted and stored on secure Firebase servers. We're fully GDPR compliant.",
            },
            {
              q: "Can I export my response data?",
              a: "Yes, you can export responses to CSV format anytime from the responses page.",
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group"
            >
              <summary className="text-white font-semibold cursor-pointer flex items-center justify-between">
                <span>{faq.q}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
              </summary>
              <p className="text-gray-400 mt-4 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Still Need Help Banner */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Still need help?
          </h3>
          <p className="text-gray-300 mb-6">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:support@formcraft.app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              <Mail className="w-5 h-5" />
              Email Support
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
            >
              Back to Dashboard
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/(dashboard)/forms/new/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createForm } from "@/lib/services/formService";
import { FileText, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function NewFormPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleCreateForm = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a form title");
      return;
    }

    setLoading(true);

    try {
      const newForm = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        fields: [], // Start with empty fields
        status: "draft",
        settings: {
          submitButtonText: "Submit",
          confirmationMessage: "Thank you for your response!",
          maxSubmissions: null,
          allowMultipleResponses: false,
          requireAuth: true,
        },
        theme: {
          primaryColor: "#8b5cf6",
          backgroundColor: "#ffffff",
          fontFamily: "Inter",
        },
      };

      const formId = await createForm(user.uid, newForm);
      toast.success("Form created successfully!");

      // Redirect to form builder
      router.push(`/forms/${formId}/edit`);
    } catch (error) {
      console.error("Error creating form:", error);
      toast.error("Failed to create form");
      setLoading(false);
    }
  };

  const handleQuickStart = async (template) => {
    setLoading(true);

    try {
      let templateData = {
        settings: {
          submitButtonText: "Submit",
          confirmationMessage: "Thank you for your response!",
          maxSubmissions: null,
          allowMultipleResponses: false,
          requireAuth: true,
        },
        theme: {
          primaryColor: "#8b5cf6",
          backgroundColor: "#ffffff",
          fontFamily: "Inter",
        },
      };

      switch (template) {
        case "feedback":
          templateData = {
            ...templateData,
            title: "Customer Feedback Form",
            description: "We value your feedback",
            status: "draft",
            fields: [
              {
                id: Date.now().toString(),
                type: "short_text",
                label: "Your Name",
                placeholder: "John Doe",
                required: true,
              },
              {
                id: (Date.now() + 1).toString(),
                type: "email",
                label: "Email Address",
                placeholder: "email@example.com",
                required: true,
              },
              {
                id: (Date.now() + 2).toString(),
                type: "rating",
                label: "How would you rate our service?",
                required: true,
                maxRating: 5,
              },
              {
                id: (Date.now() + 3).toString(),
                type: "long_text",
                label: "Additional Comments",
                placeholder: "Share your thoughts...",
                required: false,
                rows: 4,
              },
            ],
          };
          break;

        case "survey":
          templateData = {
            ...templateData,
            title: "Quick Survey",
            description: "Help us understand your needs",
            status: "draft",
            fields: [
              {
                id: Date.now().toString(),
                type: "multiple_choice",
                label: "How did you hear about us?",
                required: true,
                options: [
                  "Social Media",
                  "Search Engine",
                  "Friend",
                  "Advertisement",
                ],
              },
              {
                id: (Date.now() + 1).toString(),
                type: "checkboxes",
                label: "Which features are you interested in?",
                required: false,
                options: ["Feature A", "Feature B", "Feature C", "Feature D"],
              },
            ],
          };
          break;

        case "contact":
          templateData = {
            ...templateData,
            title: "Contact Form",
            description: "Get in touch with us",
            status: "draft",
            fields: [
              {
                id: Date.now().toString(),
                type: "short_text",
                label: "Full Name",
                placeholder: "John Doe",
                required: true,
              },
              {
                id: (Date.now() + 1).toString(),
                type: "email",
                label: "Email",
                placeholder: "email@example.com",
                required: true,
              },
              {
                id: (Date.now() + 2).toString(),
                type: "long_text",
                label: "Message",
                placeholder: "How can we help?",
                required: true,
                rows: 5,
              },
            ],
          };
          break;
      }

      const formId = await createForm(user.uid, templateData);
      toast.success("Form created from template!");
      router.push(`/forms/${formId}/edit`);
    } catch (error) {
      console.error("Error creating form from template:", error);
      toast.error("Failed to create form");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create New Form
          </h1>
          <p className="text-slate-300">
            Start from scratch or choose a template
          </p>
        </div>

        {/* Start from Scratch */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">
              Start from Scratch
            </h2>
          </div>

          <form onSubmit={handleCreateForm}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Form Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Customer Feedback Survey"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of your form"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Blank Form
                </>
              )}
            </button>
          </form>
        </div>

        {/* Templates */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">
            Quick Start Templates
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                id: "feedback",
                title: "Feedback Form",
                description: "Collect customer feedback",
                icon: "💬",
              },
              {
                id: "survey",
                title: "Survey",
                description: "Gather opinions and data",
                icon: "📊",
              },
              {
                id: "contact",
                title: "Contact Form",
                description: "Let people reach you",
                icon: "✉️",
              },
            ].map((template) => (
              <button
                key={template.id}
                onClick={() => handleQuickStart(template.id)}
                disabled={loading}
                className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-4xl mb-3">{template.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {template.title}
                </h3>
                <p className="text-sm text-slate-400">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

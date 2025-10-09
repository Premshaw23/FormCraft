"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react";

export default function CreateFormContent() {
  const [formName, setFormName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: "blank",
      name: "Blank Form",
      description: "Start with a clean slate",
      icon: "📝",
      color: "from-gray-500 to-gray-600",
    },
    {
      id: "contact",
      name: "Contact Form",
      description: "Basic contact information",
      icon: "📧",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "survey",
      name: "Survey",
      description: "Customer feedback survey",
      icon: "📊",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "registration",
      name: "Event Registration",
      description: "Register attendees",
      icon: "🎫",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "application",
      name: "Job Application",
      description: "Collect applications",
      icon: "💼",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "order",
      name: "Order Form",
      description: "Product orders",
      icon: "🛒",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const handleCreateForm = () => {
    if (!formName.trim()) {
      alert("Please enter a form name");
      return;
    }
    console.log("Creating form:", formName, "with template:", selectedTemplate);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Create New Form</h1>
        <p className="text-gray-400 text-lg">
          Choose a template or start from scratch
        </p>
      </div>

      {/* Form Name Input */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Form Name
        </label>
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="e.g., Customer Feedback Survey"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
        />
      </div>

      {/* AI Suggestion Banner
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-1">
              Try AI Form Builder
            </h3>
            <p className="text-sm text-gray-400">
              Describe your form and let AI create it for you
            </p>
          </div>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all font-medium">
          Try Now
        </button>
      </div> */}

      {/* Templates Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Choose a Template</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`group relative p-6 rounded-xl border-2 transition-all text-left ${
                selectedTemplate === template.id
                  ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${template.color} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}
              >
                {template.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-400">{template.description}</p>
              {selectedTemplate === template.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={handleCreateForm}
          disabled={!formName.trim() || !selectedTemplate}
          className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        >
          <span>Create Form</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

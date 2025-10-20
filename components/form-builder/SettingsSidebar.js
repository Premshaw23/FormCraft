// components/form-builder/SettingsSidebar.jsx - FIXED WITH DEBOUNCING
"use client";

import { useState, useRef, useEffect } from "react";
import { X, Palette, Settings as SettingsIcon, Share2 } from "lucide-react";

export default function SettingsSidebar({
  form,
  onUpdateSettings,
  onUpdateTheme,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design", icon: Palette },
    { id: "settings", label: "Settings", icon: SettingsIcon },
    { id: "share", label: "Share", icon: Share2 },
  ];

  return (
    <div className="h-full">
      {/* Mobile overlay: only visible on small screens. Clicking it closes the panel. */}
      <div
        className="fixed inset-0 bg-black/40 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
        Responsive panel:
        - On small screens: fixed slide-over from the right, full-width up to `max-w-md`.
        - On md+ screens: behaves like a normal (relative) sidebar.
      */}
      <aside
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-slate-900 md:relative md:inset-auto md:w-96 md:max-w-none md:z-0 flex flex-col h-full"
        role="dialog"
        aria-modal="true"
        aria-label="Form settings"
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Form Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "text-purple-400 border-b-2 border-purple-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "design" && (
            <DesignTab form={form} onUpdateTheme={onUpdateTheme} />
          )}
          {activeTab === "settings" && (
            <SettingsTab form={form} onUpdateSettings={onUpdateSettings} />
          )}
          {activeTab === "share" && <ShareTab form={form} />}
        </div>
      </aside>
    </div>
  );
}

// Design Tab Component - Colors don't need debouncing (instant feedback is good)
function DesignTab({ form, onUpdateTheme }) {
  const theme = form.theme || {};

  const colorPresets = [
    { name: "Purple", value: "#8b5cf6" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Red", value: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Color */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Primary Color
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {colorPresets.map((color) => (
            <button
              key={color.value}
              onClick={() =>
                onUpdateTheme({ ...theme, primaryColor: color.value })
              }
              className={`p-3 rounded-lg border-2 transition-all ${
                theme.primaryColor === color.value
                  ? "border-white"
                  : "border-white/10 hover:border-white/30"
              }`}
              style={{ backgroundColor: color.value }}
            >
              <div className="text-xs text-white font-medium">{color.name}</div>
            </button>
          ))}
        </div>
        <input
          type="color"
          value={theme.primaryColor || "#8b5cf6"}
          onChange={(e) =>
            onUpdateTheme({ ...theme, primaryColor: e.target.value })
          }
          className="w-full h-10 rounded-lg cursor-pointer"
        />
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Background Color
        </label>
        <input
          type="color"
          value={theme.backgroundColor || "#ffffff"}
          onChange={(e) =>
            onUpdateTheme({ ...theme, backgroundColor: e.target.value })
          }
          className="w-full h-10 rounded-lg cursor-pointer"
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Font Family
        </label>
        <select
          value={theme.fontFamily || "Inter"}
          onChange={(e) =>
            onUpdateTheme({ ...theme, fontFamily: e.target.value })
          }
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Lato">Lato</option>
          <option value="Poppins">Poppins</option>
        </select>
      </div>

      {/* Preview */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="text-xs text-slate-400 mb-2">Preview</div>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme.backgroundColor || "#ffffff",
            fontFamily: theme.fontFamily || "Inter",
          }}
        >
          <button
            className="px-4 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: theme.primaryColor || "#8b5cf6" }}
          >
            Submit Button
          </button>
        </div>
      </div>
    </div>
  );
}

// Settings Tab Component - WITH DEBOUNCING FOR TEXT INPUTS
function SettingsTab({ form, onUpdateSettings }) {
  const settings = form.settings || {};

  // Local state for immediate UI updates
  const [localSettings, setLocalSettings] = useState(settings);
  const timeoutRef = useRef(null);

  // Update local state when form settings change externally
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Debounced save function
  const handleDebouncedUpdate = (updates) => {
    // Update local state immediately
    setLocalSettings((prev) => ({ ...prev, ...updates }));

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to save after 1.5 seconds
    timeoutRef.current = setTimeout(() => {
      onUpdateSettings({ ...settings, ...updates });
    }, 1500);
  };

  // Immediate save for toggles (no debounce needed)
  const handleImmediateUpdate = (updates) => {
    const newSettings = { ...settings, ...updates };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Submit Button Text - DEBOUNCED */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Submit Button Text
        </label>
        <input
          type="text"
          value={localSettings.submitButtonText || "Submit"}
          onChange={(e) =>
            handleDebouncedUpdate({ submitButtonText: e.target.value })
          }
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Confirmation Message - DEBOUNCED */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Confirmation Message
        </label>
        <textarea
          value={
            localSettings.confirmationMessage || "Thank you for your response!"
          }
          onChange={(e) =>
            handleDebouncedUpdate({ confirmationMessage: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      {/* Max Submissions - DEBOUNCED */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Maximum Submissions (Optional)
        </label>
        <input
          type="number"
          value={localSettings.maxSubmissions || ""}
          onChange={(e) =>
            handleDebouncedUpdate({
              maxSubmissions: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          placeholder="Unlimited"
          min="1"
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Toggles - IMMEDIATE (No debounce for checkboxes) */}
      <div className="space-y-3">
        {/* Allow Multiple Responses */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div>
            <div className="text-sm font-medium text-white">
              Multiple Responses
            </div>
            <div className="text-xs text-slate-400">
              Allow users to submit multiple times
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.allowMultipleResponses || false}
              onChange={(e) =>
                handleImmediateUpdate({
                  allowMultipleResponses: e.target.checked,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Require Authentication */}
        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
          <div>
            <div className="text-sm font-medium text-white">
              Require Authentication
            </div>
            <div className="text-xs text-slate-400">
              Only signed-in users can respond
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={localSettings.requireAuth !== false}
              onChange={(e) =>
                handleImmediateUpdate({ requireAuth: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Share Tab Component - No changes needed
function ShareTab({ form }) {
  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/f/${form.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Share Link */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Form Link
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Copy
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Share this link with people you want to fill the form
        </p>
      </div>

      {/* Status Info */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300">Form Status</span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              form.status === "published"
                ? "bg-green-600 text-white"
                : "bg-yellow-600 text-white"
            }`}
          >
            {form.status?.toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {form.status === "published"
            ? "Your form is live and accepting responses"
            : "Publish your form to start collecting responses"}
        </p>
      </div>
    </div>
  );
}

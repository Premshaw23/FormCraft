// components/form-builder/FormBuilderLayout.jsx - COMPLETE VERSION
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Settings,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import FieldPalette from "./FieldPalette";
import FormCanvas from "./FormCanvas";
import SettingsSidebar from "./SettingsSidebar";
import PreviewModal from "./modals/PreviewModal";
import { updateForm } from "@/lib/services/formService";
import toast from "react-hot-toast";

export default function FormBuilderLayout({
  form,
  saving,
  lastSaved,
  onAddField,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  onReorderFields,
  onUpdateMetadata,
  onUpdateSettings,
  onUpdateTheme,
}) {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (form.fields.length === 0) {
      toast.error("Add at least one field before publishing");
      return;
    }

    setIsPublishing(true);

    try {
      await updateForm(form.id, {
        status: "published",
        updatedAt: new Date(),
      });

      toast.success("Form published successfully! 🎉");
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Error publishing form:", error);
      toast.error("Failed to publish form");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* ===== TOP NAVIGATION BAR ===== */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side: Back Button + Form Title */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>

            <div className="flex-1 min-w-0">
              {/* Editable Form Title */}
              <input
                type="text"
                value={form.title}
                onChange={(e) => onUpdateMetadata({ title: e.target.value })}
                className="text-xl font-semibold text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 w-full max-w-md"
                placeholder="Untitled Form"
              />

              {/* Save Status Indicator */}
              <div className="flex items-center gap-2 text-sm mt-1">
                {saving ? (
                  <>
                    <Loader2 className="w-3 h-3 text-purple-400 animate-spin" />
                    <span className="text-slate-400">Saving...</span>
                  </>
                ) : lastSaved ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-green-400" />
                    <span className="text-slate-400">
                      Saved{" "}
                      {formatDistanceToNow(lastSaved, { addSuffix: true })}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">Draft</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Preview Button */}
            <button
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2 border border-white/10"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>

            {/* Settings Toggle Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-all border ${
                showSettings
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-white/10 hover:bg-white/20 text-white border-white/10"
              }`}
              title="Form Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ===== 3-COLUMN LAYOUT ===== */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Field Palette */}
        <div className="w-72 bg-slate-900/30 backdrop-blur-xl border-r border-white/10 overflow-y-auto">
          <FieldPalette onAddField={onAddField} />
        </div>

        {/* CENTER - Form Canvas (Main Editing Area) */}
        <div className="flex-1 overflow-y-auto bg-slate-800/20">
          <FormCanvas
            form={form}
            onUpdateField={onUpdateField}
            onDeleteField={onDeleteField}
            onDuplicateField={onDuplicateField}
            onReorderFields={onReorderFields}
            onUpdateMetadata={onUpdateMetadata}
          />
        </div>

        {/* RIGHT SIDEBAR - Settings Panel (conditional) */}
        {showSettings && (
          <div className="w-96 bg-slate-900/30 backdrop-blur-xl border-l border-white/10 overflow-y-auto">
            <SettingsSidebar
              form={form}
              onUpdateSettings={onUpdateSettings}
              onUpdateTheme={onUpdateTheme}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}
      </div>

      {/* ===== PREVIEW MODAL ===== */}
      {showPreview && (
        <PreviewModal form={form} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

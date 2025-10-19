// components/form-builder/modals/PreviewModal.jsx
"use client";

import { X, Monitor, Tablet, Smartphone } from "lucide-react";
import { useState } from "react";
import FieldPreview from "@/components/form-builder/fields/FieldPreview";

export default function PreviewModal({ form, onClose }) {
  const [viewMode, setViewMode] = useState("desktop"); // desktop, tablet, mobile

  const viewModes = [
    { id: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
    { id: "tablet", label: "Tablet", icon: Tablet, width: "768px" },
    { id: "mobile", label: "Mobile", icon: Smartphone, width: "375px" },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full h-full max-h-[90vh] flex flex-col border border-white/10">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Form Preview</h2>
            <p className="text-slate-400 text-sm mt-1">
              How your form will look to respondents
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
              {viewModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === mode.id
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                    title={mode.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto bg-slate-800/50 p-8">
          <div
            className="mx-auto transition-all duration-300"
            style={{
              width: viewModes.find((m) => m.id === viewMode)?.width,
              maxWidth: "100%",
            }}
          >
            {/* Form Preview Card */}
            <div
              className="rounded-2xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: form.theme?.backgroundColor || "#ffffff",
                fontFamily: form.theme?.fontFamily || "Inter",
              }}
            >
              {/* Form Header */}
              <div
                className="p-8 border-b"
                style={{
                  borderColor: `${form.theme?.primaryColor || "#8b5cf6"}20`,
                }}
              >
                <h1
                  className="text-3xl font-bold mb-3"
                  style={{
                    color: form.theme?.primaryColor || "#8b5cf6",
                  }}
                >
                  {form.title || "Untitled Form"}
                </h1>
                {form.description && (
                  <p className="text-gray-600 text-lg">{form.description}</p>
                )}
              </div>

              {/* Form Fields */}
              <div className="p-8 space-y-6">
                {form.fields.length > 0 ? (
                  form.fields.map((field) => (
                    <div key={field.id}>
                      <FormFieldPreview field={field} theme={form.theme} />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p>No fields added yet</p>
                  </div>
                )}

                {/* Submit Button */}
                {form.fields.length > 0 && (
                  <button
                    className="w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all hover:opacity-90"
                    style={{
                      backgroundColor: form.theme?.primaryColor || "#8b5cf6",
                    }}
                    disabled
                  >
                    {form.settings?.submitButtonText || "Submit"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component to render form fields in preview
function FormFieldPreview({ field, theme }) {
  const primaryColor = theme?.primaryColor || "#8b5cf6";

  // Render based on field type
  switch (field.type) {
    case "short_text":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": primaryColor }}
            disabled
          />
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
          )}
        </div>
      );

    case "long_text":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 resize-none"
            style={{ "--tw-ring-color": primaryColor }}
            disabled
          />
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
          )}
        </div>
      );

    case "email":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="email"
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": primaryColor }}
            disabled
          />
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
          )}
        </div>
      );

    case "number":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="number"
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": primaryColor }}
            disabled
          />
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
          )}
        </div>
      );

    case "date":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": primaryColor }}
            disabled
          />
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
          )}
        </div>
      );

    case "rating":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex gap-2">
            {[...Array(field.maxRating || 5)].map((_, i) => (
              <button
                key={i}
                className="text-3xl transition-all hover:scale-110"
                style={{ color: primaryColor }}
                disabled
              >
                ★
              </button>
            ))}
          </div>
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
          )}
        </div>
      );

    case "multiple_choice":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.id}
                  style={{ accentColor: primaryColor }}
                  disabled
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-2">{field.helpText}</p>
          )}
        </div>
      );

    case "checkboxes":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  style={{ accentColor: primaryColor }}
                  disabled
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-2">{field.helpText}</p>
          )}
        </div>
      );

    case "dropdown":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": primaryColor }}
            disabled
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>
          )}
        </div>
      );

    case "file_upload":
      return (
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-600">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400 mt-1">
              Max size: {field.maxSize}MB
            </p>
          </div>
          {field.helpText && (
            <p className="text-sm text-gray-500 mt-2">{field.helpText}</p>
          )}
        </div>
      );

    case "section_heading":
      return (
        <div className="pt-4">
          <h3
            className="text-2xl font-bold mb-2"
            style={{ color: primaryColor }}
          >
            {field.text || "Section Heading"}
          </h3>
          {field.description && (
            <p className="text-gray-600">{field.description}</p>
          )}
        </div>
      );

    case "divider":
      return <hr className="border-gray-300 my-4" />;

    default:
      return null;
  }
}

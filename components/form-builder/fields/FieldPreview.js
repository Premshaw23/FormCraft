// components/form-builder/fields/FieldPreview.jsx
"use client";

import { Star } from "lucide-react";

export default function FieldPreview({ field, onUpdate }) {
  // Render field based on type
  const renderField = () => {
    switch (field.type) {
      case "short_text":
        return (
          <input
            type="text"
            placeholder={field.placeholder}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          />
        );

      case "long_text":
        return (
          <textarea
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled
          />
        );

      case "email":
        return (
          <input
            type="email"
            placeholder={field.placeholder}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          />
        );

      case "rating":
        return (
          <div className="flex gap-2">
            {[...Array(field.maxRating || 5)].map((_, i) => (
              <Star
                key={i}
                className="w-8 h-8 text-yellow-400 fill-yellow-400/20 cursor-not-allowed"
              />
            ))}
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-not-allowed"
              >
                <input
                  type="radio"
                  name={field.id}
                  className="w-4 h-4 text-purple-600"
                  disabled
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        );

      case "checkboxes":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-not-allowed"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 rounded"
                  disabled
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <select
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          >
            <option value="">{field.placeholder || "Select an option"}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "file_upload":
        return (
          <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-not-allowed">
            <div className="text-slate-400 mb-2">📁</div>
            <p className="text-slate-400 text-sm">
              Click to upload or drag and drop
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Max size: {field.maxSize}MB
            </p>
          </div>
        );

      case "section_heading":
        return (
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {field.text || "Section Heading"}
            </h3>
            {field.description && (
              <p className="text-slate-400">{field.description}</p>
            )}
          </div>
        );

      case "divider":
        return <div className="border-t border-white/20"></div>;

      default:
        return (
          <div className="text-slate-400">Unknown field type: {field.type}</div>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Field Label (Editable) */}
      {field.type !== "section_heading" && field.type !== "divider" && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="text-base font-medium text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
            placeholder="Question"
          />
          {field.required && <span className="text-red-400 text-lg">*</span>}
        </div>
      )}

      {/* Field Input Preview */}
      <div onClick={(e) => e.stopPropagation()}>{renderField()}</div>

      {/* Help Text (if exists) */}
      {field.helpText && (
        <p className="text-sm text-slate-400">{field.helpText}</p>
      )}
    </div>
  );
}

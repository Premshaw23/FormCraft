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
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          />
        );

      case "long_text":
        return (
          <textarea
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled
          />
        );

      case "email":
        return (
          <input
            type="email"
            placeholder={field.placeholder}
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled
          />
        );

      case "rating":
        return (
          <div className="flex gap-1.5 sm:gap-2 items-center flex-wrap">
            {[...Array(field.maxRating || 5)].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400 fill-yellow-400/20 cursor-not-allowed"
              />
            ))}
          </div>
        );

      case "multiple_choice":
        return (
          <div className="space-y-2">
            <div className="flex flex-col gap-2 min-w-0">
              {field.options?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-lg cursor-not-allowed min-w-0 hover:bg-white/10 transition-colors"
                >
                  <input
                    type="radio"
                    name={field.id}
                    className="w-4 h-4 text-purple-600 flex-shrink-0"
                    disabled
                  />
                  <span className="text-white text-sm sm:text-base truncate break-words">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "checkboxes":
        return (
          <div className="space-y-2">
            <div className="flex flex-col gap-2 min-w-0">
              {field.options?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-lg cursor-not-allowed min-w-0 hover:bg-white/10 transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 rounded flex-shrink-0"
                    disabled
                  />
                  <span className="text-white text-sm sm:text-base truncate break-words">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case "dropdown":
        return (
          <select
            className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
          <div className="border-2 border-dashed border-white/20 rounded-lg p-4 sm:p-6 md:p-8 text-center cursor-not-allowed hover:border-white/30 transition-colors">
            <div className="text-2xl sm:text-3xl mb-2">📁</div>
            <p className="text-slate-400 text-xs sm:text-sm">
              Click to upload or drag and drop
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Max size: {field.maxSize}MB
            </p>
          </div>
        );

      case "section_heading":
        return (
          <div className="py-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5 sm:mb-2 break-words">
              {field.text || "Section Heading"}
            </h3>
            {field.description && (
              <p className="text-slate-400 text-sm sm:text-base break-words">
                {field.description}
              </p>
            )}
          </div>
        );

      case "divider":
        return <div className="border-t border-white/20 my-2 sm:my-3"></div>;

      default:
        return (
          <div className="text-slate-400 text-sm sm:text-base">
            Unknown field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2 sm:space-y-3 w-full">
      {/* Field Label (Editable) */}
      {field.type !== "section_heading" && field.type !== "divider" && (
        <div className="flex items-start gap-2">
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            className="text-sm sm:text-base font-medium text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 flex-1 w-full"
            placeholder="Question"
          />
          {field.required && (
            <span className="text-red-400 text-base sm:text-lg flex-shrink-0 leading-tight mt-0.5">
              *
            </span>
          )}
        </div>
      )}

      {/* Field Input Preview */}
      <div onClick={(e) => e.stopPropagation()} className="w-full">
        {renderField()}
      </div>

      {/* Help Text (if exists) */}
      {field.helpText && (
        <p className="text-xs sm:text-sm text-slate-400 break-words">
          {field.helpText}
        </p>
      )}
    </div>
  );
}

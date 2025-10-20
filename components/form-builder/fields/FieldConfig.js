// components/form-builder/fields/FieldConfig.jsx
"use client";

import { Plus, X } from "lucide-react";

export default function FieldConfig({ field, onUpdate, onClose }) {
  // Handle option changes for choice fields
  const handleOptionChange = (index, value) => {
    const newOptions = [...field.options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [
      ...(field.options || []),
      `Option ${(field.options?.length || 0) + 1}`,
    ];
    onUpdate({ options: newOptions });
  };

  const handleRemoveOption = (index) => {
    const newOptions = field.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3 md:gap-0">
        <h4 className="text-white font-semibold">Field Configuration</h4>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Common Fields */}
      {field.type !== "section_heading" && field.type !== "divider" && (
        <>
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Question Label
            </label>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate({ label: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter question"
            />
          </div>

          {/* Placeholder (for text/email/number/dropdown) */}
          {["short_text", "long_text", "email", "number", "dropdown"].includes(
            field.type
          ) && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Placeholder Text
              </label>
              <input
                type="text"
                value={field.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter placeholder"
              />
            </div>
          )}

          {/* Help Text */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Help Text (Optional)
            </label>
            <input
              type="text"
              value={field.helpText || ""}
              onChange={(e) => onUpdate({ helpText: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Add helpful instructions"
            />
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-sm font-medium text-white">
                Required Field
              </div>
              <div className="text-xs text-slate-400">
                User must answer this question
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={field.required || false}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </>
      )}

      {/* Type-Specific Fields */}

      {/* Long Text: Rows */}
      {field.type === "long_text" && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Number of Rows
          </label>
          <input
            type="number"
            value={field.rows || 4}
            onChange={(e) => onUpdate({ rows: parseInt(e.target.value) || 4 })}
            min="2"
            max="20"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Number: Min/Max */}
      {field.type === "number" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Min Value
            </label>
            <input
              type="number"
              value={field.validation?.min || ""}
              onChange={(e) =>
                onUpdate({
                  validation: {
                    ...field.validation,
                    min: e.target.value ? parseInt(e.target.value) : null,
                  },
                })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="No limit"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Value
            </label>
            <input
              type="number"
              value={field.validation?.max || ""}
              onChange={(e) =>
                onUpdate({
                  validation: {
                    ...field.validation,
                    max: e.target.value ? parseInt(e.target.value) : null,
                  },
                })
              }
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="No limit"
            />
          </div>
        </div>
      )}

      {/* Rating: Max Rating */}
      {field.type === "rating" && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Maximum Rating
          </label>
          <select
            value={field.maxRating || 5}
            onChange={(e) => onUpdate({ maxRating: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="3">3 Stars</option>
            <option value="5">5 Stars</option>
            <option value="10">10 Stars</option>
          </select>
        </div>
      )}

      {/* Choice Fields: Options */}
      {["multiple_choice", "checkboxes", "dropdown"].includes(field.type) && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                  placeholder={`Option ${index + 1}`}
                />
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors self-start sm:self-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddOption}
              className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-lg text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Option
            </button>
          </div>
        </div>
      )}

      {/* Section Heading Fields */}
      {field.type === "section_heading" && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Heading Text
            </label>
            <input
              type="text"
              value={field.text || ""}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Section Title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={field.description || ""}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Optional description"
            />
          </div>
        </>
      )}

      {/* File Upload: Max Size & Allowed Types */}
      {field.type === "file_upload" && (
        <>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max File Size (MB)
            </label>
            <input
              type="number"
              value={field.maxSize || 10}
              onChange={(e) =>
                onUpdate({ maxSize: parseInt(e.target.value) || 10 })
              }
              min="1"
              max="100"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </>
      )}
    </div>
  );
}

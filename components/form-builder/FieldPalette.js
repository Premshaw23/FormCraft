// components/form-builder/FieldPalette.jsx
"use client";

import { FIELD_TYPES } from "@/lib/constants/fieldTypes";
import { Plus } from "lucide-react";

export default function FieldPalette({ onAddField }) {
  // Group field types by category
  const fieldGroups = [
    {
      title: "📝 Text Inputs",
      fields: [
        FIELD_TYPES.SHORT_TEXT,
        FIELD_TYPES.LONG_TEXT,
        FIELD_TYPES.EMAIL,
      ],
    },
    {
      title: "🔢 Numbers & Rating",
      fields: [FIELD_TYPES.NUMBER, FIELD_TYPES.RATING],
    },
    {
      title: "📅 Date & Time",
      fields: [FIELD_TYPES.DATE],
    },
    {
      title: "☑️ Choice Fields",
      fields: [
        FIELD_TYPES.MULTIPLE_CHOICE,
        FIELD_TYPES.CHECKBOXES,
        FIELD_TYPES.DROPDOWN,
      ],
    },
    {
      title: "📁 File Upload",
      fields: [FIELD_TYPES.FILE_UPLOAD],
    },
    {
      title: "🎨 Layout Elements",
      fields: [FIELD_TYPES.SECTION_HEADING, FIELD_TYPES.DIVIDER],
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-white mb-6">Add Fields</h2>

      {/* Field Groups */}
      <div className="space-y-6">
        {fieldGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Group Title */}
            <h3 className="text-sm font-semibold text-slate-400 mb-3">
              {group.title}
            </h3>

            {/* Field Buttons */}
            <div className="space-y-2">
              {group.fields.map((field) => {
                const IconComponent = field.icon;

                return (
                  <button
                    key={field.id}
                    onClick={() => onAddField(field)}
                    className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-lg transition-all group text-left flex items-center gap-3"
                    title={field.description}
                  >
                    {/* Icon */}
                    <div className="w-8 h-8 bg-purple-600/20 group-hover:bg-purple-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-purple-400" />
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                        {field.label}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {field.description}
                      </div>
                    </div>

                    {/* Add Icon */}
                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Helper Text */}
      <div className="mt-8 p-4 bg-purple-600/10 border border-purple-500/20 rounded-lg">
        <p className="text-xs text-slate-300">
          💡 <strong>Tip:</strong> Click any field type to add it to your form.
          You can reorder fields by dragging them in the canvas.
        </p>
      </div>
    </div>
  );
}

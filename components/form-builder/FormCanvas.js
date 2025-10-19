// components/form-builder/FormCanvas.jsx - PART 1
"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import FieldWrapper from "./fields/FieldWrapper";

export default function FormCanvas({
  form,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  onReorderFields,
  onUpdateMetadata,
}) {
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Form Header Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
        {/* Form Title (Editable) */}
        <input
          type="text"
          value={form.title}
          onChange={(e) => onUpdateMetadata({ title: e.target.value })}
          className="text-3xl font-bold text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 w-full mb-4"
          placeholder="Untitled Form"
        />

        {/* Form Description (Editable) */}
        <textarea
          value={form.description || ""}
          onChange={(e) => onUpdateMetadata({ description: e.target.value })}
          className="text-slate-300 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 w-full resize-none"
          placeholder="Add a description to your form (optional)"
          rows={2}
        />
      </div>

      {/* Fields List */}
      {form.fields.length > 0 ? (
        <div className="space-y-4 mb-8">
          {form.fields.map((field, index) => (
            <FieldWrapper
              key={field.id}
              field={field}
              index={index}
              isSelected={selectedFieldId === field.id}
              onSelect={() => setSelectedFieldId(field.id)}
              onUpdate={(updates) => onUpdateField(field.id, updates)}
              onDelete={() => onDeleteField(field.id)}
              onDuplicate={() => onDuplicateField(field.id)}
              onMoveUp={() => {
                if (index > 0) {
                  onReorderFields(index, index - 1);
                }
              }}
              onMoveDown={() => {
                if (index < form.fields.length - 1) {
                  onReorderFields(index, index + 1);
                }
              }}
            />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Your form is empty
          </h3>
          <p className="text-slate-400 mb-6">
            Add fields from the left sidebar to get started
          </p>
          <div className="inline-flex items-center gap-2 text-purple-400">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Click any field type to add it</span>
          </div>
        </div>
      )}
    </div>
  );
}

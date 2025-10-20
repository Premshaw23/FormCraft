// components/form-builder/FormCanvas.jsx - COMPLETE DRAG SOLUTION
"use client";

import { useState, useRef, useEffect } from "react";
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
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Local state for immediate UI updates
  const [localTitle, setLocalTitle] = useState(form.title);
  const [localDescription, setLocalDescription] = useState(
    form.description || ""
  );

  // Refs for debouncing
  const titleTimeoutRef = useRef(null);
  const descriptionTimeoutRef = useRef(null);

  // Update local state when form changes externally
  useEffect(() => {
    setLocalTitle(form.title);
    setLocalDescription(form.description || "");
  }, [form.title, form.description]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
      if (descriptionTimeoutRef.current)
        clearTimeout(descriptionTimeoutRef.current);
    };
  }, []);

  // Debounced title update
  const handleTitleChange = (newTitle) => {
    setLocalTitle(newTitle);
    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }
    titleTimeoutRef.current = setTimeout(() => {
      onUpdateMetadata({ title: newTitle });
    }, 1500);
  };

  // Debounced description update
  const handleDescriptionChange = (newDescription) => {
    setLocalDescription(newDescription);
    if (descriptionTimeoutRef.current) {
      clearTimeout(descriptionTimeoutRef.current);
    }
    descriptionTimeoutRef.current = setTimeout(() => {
      onUpdateMetadata({ description: newDescription });
    }, 1500);
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderFields(draggedIndex, dropIndex);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Form Header Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
        {/* Form Title (Editable) - DEBOUNCED */}
        <input
          type="text"
          value={localTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-3xl font-bold text-white bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 w-full mb-4"
          placeholder="Untitled Form"
        />

        {/* Form Description (Editable) - DEBOUNCED */}
        <textarea
          value={localDescription}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          className="text-slate-300 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 w-full resize-none"
          placeholder="Add a description to your form (optional)"
          rows={2}
        />
      </div>

      {/* Fields List */}
      {form.fields.length > 0 ? (
        <div className="space-y-4 mb-8">
          {form.fields.map((field, index) => (
            <div
              key={field.id}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={`transition-all ${
                draggedIndex === index ? "opacity-50 scale-95" : ""
              } ${
                dragOverIndex === index && draggedIndex !== index
                  ? "translate-y-2"
                  : ""
              }`}
            >
              <FieldWrapper
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
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
              />
            </div>
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

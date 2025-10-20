// components/form-builder/fields/FieldWrapper.jsx - FIXED DRAG
"use client";

import { useState, useCallback } from "react";
import {
  GripVertical,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings,
  X,
} from "lucide-react";
import FieldPreview from "./FieldPreview";
import FieldConfig from "./FieldConfig";

export default function FieldWrapper({
  field,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragEnd,
}) {
  const [showConfig, setShowConfig] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  // Prevent unnecessary re-renders
  const handleUpdate = useCallback(
    (updates) => {
      onUpdate(updates);
    },
    [onUpdate]
  );

  // Handle drag start from the grip icon
  const handleDragHandleMouseDown = (e) => {
    // Enable dragging on the parent
    const wrapper = e.currentTarget.closest("[data-field-wrapper]");
    if (wrapper) {
      wrapper.setAttribute("draggable", "true");
    }
  };

  const handleDragHandleMouseUp = (e) => {
    // Disable dragging when not holding the grip
    const wrapper = e.currentTarget.closest("[data-field-wrapper]");
    if (wrapper) {
      wrapper.setAttribute("draggable", "false");
    }
  };

  return (
    <div
      data-field-wrapper
      draggable="false"
      onDragStart={onDragStart}
      onDragEnd={(e) => {
        onDragEnd?.(e);
        // Disable dragging after drag ends
        e.currentTarget.setAttribute("draggable", "false");
      }}
      className={`bg-white/5 backdrop-blur-sm border rounded-xl transition-all ${
        isSelected
          ? "border-purple-500 ring-2 ring-purple-500/20"
          : "border-white/10 hover:border-white/20"
      }`}
      onClick={onSelect}
    >
      {/* Field Header - Always Visible */}
      <div className="p-4 flex md:flex-row md:items-start flex-col justify-end gap-3">
        {/* Drag Handle */}
        <div
          className="mt-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-white transition-colors"
          onMouseDown={handleDragHandleMouseDown}
          onMouseUp={handleDragHandleMouseUp}
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Field Content */}
        <div className="flex-1 min-w-0">
          {/* Field Preview */}
          <FieldPreview field={field} onUpdate={handleUpdate} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Move Up */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Move Up"
          >
            <ChevronUp className="w-4 h-4 text-slate-400" />
          </button>

          {/* Move Down */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Move Down"
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Configure */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfig(!showConfig);
            }}
            className={`p-1.5 rounded transition-colors ${
              showConfig
                ? "bg-purple-600 text-white"
                : "hover:bg-white/10 text-slate-400"
            }`}
            title="Configure Field"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Duplicate */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 text-slate-400" />
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* Field Configuration Panel (Expandable) */}
      {showConfig && (
        <div className="border-t border-white/10 p-4 bg-white/5">
          <FieldConfig
            field={field}
            onUpdate={handleUpdate}
            onClose={() => setShowConfig(false)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="border-t border-white/10 p-4 bg-red-500/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold">Delete this field?</h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-300 text-sm mb-4">
            This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Delete
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(false);
              }}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

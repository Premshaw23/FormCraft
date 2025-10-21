// components/responses/ResponseDetailModal.jsx - FIXED DATE ISSUE
"use client";
import React from "react";
import {
  X,
  User,
  Mail,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

const ResponseDetailModal = ({
  response,
  formFields,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  onDelete,
}) => {
  if (!response) return null;

  const getFieldLabel = (fieldId) => {
    const field = formFields.find((f) => f.id === fieldId);
    return field?.label || fieldId;
  };

  const getFieldType = (fieldId) => {
    const field = formFields.find((f) => f.id === fieldId);
    return field?.type || "text";
  };

  // Helper to safely parse dates
  const parseDate = (dateValue) => {
    if (!dateValue) return null;

    try {
      // If it's already a Date object
      if (dateValue instanceof Date) {
        return isValid(dateValue) ? dateValue : null;
      }

      // If it's a Firestore Timestamp
      if (dateValue.toDate && typeof dateValue.toDate === "function") {
        return dateValue.toDate();
      }

      // If it's a timestamp number
      if (typeof dateValue === "number") {
        const date = new Date(dateValue);
        return isValid(date) ? date : null;
      }

      // If it's an ISO string
      if (typeof dateValue === "string") {
        const date = parseISO(dateValue);
        return isValid(date) ? date : null;
      }

      return null;
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  };

  const formatAnswer = (fieldId, value) => {
    const fieldType = getFieldType(fieldId);

    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-500 italic">No answer</span>;
    }

    // Handle arrays (checkboxes)
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-500 italic">No selection</span>;
      }
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    // Handle rating
    if (fieldType === "rating") {
      return (
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-2xl ${
                i < value ? "text-yellow-400" : "text-gray-600"
              }`}
            >
              ★
            </span>
          ))}
        </div>
      );
    }

    // Handle scale
    if (fieldType === "scale") {
      return (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${(value / 10) * 100}%` }}
            />
          </div>
          <span className="text-2xl font-bold text-purple-400">{value}</span>
        </div>
      );
    }

    // Handle file upload
    if (fieldType === "file-upload") {
      return (
        <div className="flex items-center gap-2 text-blue-400">
          <Download className="w-4 h-4" />
          {typeof value === "object" ? value.name : value}
        </div>
      );
    }

    // Handle long text
    if (fieldType === "long-text" && value.length > 100) {
      return (
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-4">
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            {value}
          </p>
        </div>
      );
    }

    // Default: return as text
    return <p className="text-gray-300">{value}</p>;
  };

  // Parse the submission date
  const submittedDate = parseDate(response.submittedAt);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] 
                      overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 
                            rounded-full flex items-center justify-center text-white font-bold text-lg"
            >
              {response.metadata?.userName?.[0]?.toUpperCase() || "A"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {response.metadata?.userName || "Anonymous User"}
              </h2>
              <p className="text-sm text-gray-400">Response Details</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Navigation */}
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 
                         disabled:cursor-not-allowed"
              title="Previous Response"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 
                         disabled:cursor-not-allowed"
              title="Next Response"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                if (confirm("Delete this response?")) {
                  onDelete(response.id);
                  onClose();
                }
              }}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
              title="Delete Response"
            >
              <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: User Info */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6 sticky top-0">
                <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">
                  Submission Info
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <User className="w-4 h-4" />
                      <span className="text-xs">Name</span>
                    </div>
                    <p className="text-white font-medium">
                      {response.metadata?.userName || "Anonymous"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-xs">Email</span>
                    </div>
                    <p className="text-white font-medium break-all">
                      {response.metadata?.userEmail || "N/A"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Submitted At</span>
                    </div>
                    <p className="text-white font-medium">
                      {submittedDate
                        ? format(submittedDate, "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {submittedDate ? format(submittedDate, "h:mm a") : ""}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Response ID</span>
                    </div>
                    <p className="text-white font-mono text-xs break-all">
                      {response.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Answers */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Responses
              </h3>

              {(() => {
                const layoutTypes = ['section_heading', 'divider', 'description_text'];

                // Build entries but skip layout-only fields
                const answerEntries = Object.entries(response.answers || {}).filter(
                  ([fieldId, value]) => {
                    const fieldType = getFieldType(fieldId);
                    return !layoutTypes.includes(fieldType);
                  }
                );

                if (answerEntries.length === 0) {
                  return (
                    <p className="text-gray-500 text-center py-8">
                      No answers recorded
                    </p>
                  );
                }

                return answerEntries.map(([fieldId, value]) => {
                  const label = getFieldLabel(fieldId);

                  return (
                    <div
                      key={fieldId}
                      className="bg-slate-800/30 border border-white/5 rounded-xl p-5"
                    >
                      <h4 className="text-sm font-semibold text-gray-400 mb-3">
                        {label}
                      </h4>
                      {formatAnswer(fieldId, value)}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/5 border border-white/10 text-gray-300 
                       rounded-lg hover:bg-white/10 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseDetailModal;

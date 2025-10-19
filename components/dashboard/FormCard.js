// components/dashboard/FormCard.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  Edit,
  Eye,
  BarChart3,
  Share2,
  Copy,
  Archive,
  Trash2,
  Clock,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function FormCard({ form, viewMode = "grid", onDelete, onDuplicate }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleEdit = () => {
    router.push(`/forms/${form.id}/edit`);
  };

  const handlePreview = () => {
    window.open(`/f/${form.id}`, "_blank");
  };

  const handleResponses = () => {
    router.push(`/forms/${form.id}/responses`);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/f/${form.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Form link copied to clipboard!");
    setMenuOpen(false);
  };

  const handleDuplicate = () => {
    onDuplicate?.(form.id);
    setMenuOpen(false);
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
    setMenuOpen(false);
  };

  const confirmDelete = () => {
    onDelete?.(form.id);
    setDeleteModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Grid View
  if (viewMode === "grid") {
    return (
      <>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-purple-500/50 transition-all group">
          {/* Thumbnail Preview */}
          <div className="h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 flex items-center justify-center border-b border-white/10">
            <FileText className="w-12 h-12 text-purple-400 opacity-50" />
          </div>

          {/* Card Content */}
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                  {form.title}
                </h3>
              </div>
              <div
                className={`ml-2 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                  form.status
                )} flex-shrink-0`}
              >
                {form.status}
              </div>
            </div>

            <p className="text-gray-400 text-sm line-clamp-2 mb-4 min-h-[2.5rem]">
              {form.description || "No description"}
            </p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{form.fields?.length || 0} fields</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span>{form.responseCount || 0} responses</span>
              </div>
            </div>

            {/* Last Edited */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
              <Clock className="w-3 h-3" />
              <span>
                Updated{" "}
                {format(
                  typeof form.updatedAt === "string"
                    ? new Date(form.updatedAt)
                    : form.updatedAt.toDate(),
                  "MMM d, yyyy"
                )}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handlePreview}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                title="Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
              {form.status === "published" && (
                <button
                  onClick={handleResponses}
                  className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                  title="Responses"
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                  title="More"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl py-2 z-50">
                      <button
                        onClick={handleDuplicate}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </button>
                      <button
                        onClick={handleShare}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                      >
                        <Share2 className="w-4 h-4" />
                        Copy Link
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm">
                        <Archive className="w-4 h-4" />
                        Archive
                      </button>
                      <div className="border-t border-white/10 my-2" />
                      <button
                        onClick={handleDelete}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-white/10 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-2">
                Delete Form?
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{form.title}"? This action
                cannot be undone and all responses will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // List View
  return (
    <>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-purple-500/50 transition-all group">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Form Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                  {form.title}
                </h3>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                    form.status
                  )} flex-shrink-0`}
                >
                  {form.status}
                </div>
              </div>
              <p className="text-gray-400 text-sm truncate mb-2">
                {form.description || "No description"}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{form.fields?.length || 0} fields</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  <span>{form.responseCount || 0} responses</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    Updated{" "}
                    {format(
                      typeof form.updatedAt === "string"
                        ? new Date(form.updatedAt)
                        : form.updatedAt.toDate(),
                      "MMM d, yyyy"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handlePreview}
              className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
            {form.status === "published" && (
              <button
                onClick={handleResponses}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                title="Responses"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                title="More"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl py-2 z-50">
                    <button
                      onClick={handleDuplicate}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      Copy Link
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm">
                      <Archive className="w-4 h-4" />
                      Archive
                    </button>
                    <div className="border-t border-white/10 my-2" />
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-800 border border-white/10 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Delete Form?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete "{form.title}"? This action cannot
              be undone and all responses will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
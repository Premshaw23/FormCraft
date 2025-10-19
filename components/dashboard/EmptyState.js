// components/dashboard/EmptyState.jsx
"use client";
import Link from "next/link";
import { FileQuestion, Plus } from "lucide-react";

export default function EmptyState({
  title = "No items found",
  description = "Get started by creating something new",
  actionText = "Create New",
  actionHref = "/forms/new",
  onActionClick = null,
  icon: Icon = FileQuestion,
}) {
  const handleClick = (e) => {
    if (onActionClick) {
      e.preventDefault();
      onActionClick();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon with glow effect */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center border border-white/10">
          <Icon className="w-12 h-12 text-purple-400" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-400 mb-8 max-w-md">{description}</p>

      {/* Action Button */}
      {actionText && (
        <Link
          href={actionHref}
          onClick={handleClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          {actionText}
        </Link>
      )}

      {/* Help Link */}
      <a
        href="/help"
        className="mt-4 text-sm text-gray-500 hover:text-purple-400 transition-colors"
      >
        Need help getting started?
      </a>
    </div>
  );
}

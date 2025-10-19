// app/(dashboard)/responses/page.js
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForms } from "@/lib/hooks/useForms";
import Link from "next/link";
import {
  BarChart3,
  FileText,
  TrendingUp,
  Clock,
  Search,
  Filter,
  Download,
  ChevronRight,
  Loader2,
  Calendar,
  Users,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";

export default function ResponsesOverviewPage() {
  const { user } = useAuth();
  const { forms, loading } = useForms(user?.uid);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all"); // all, today, week, month

  // Filter forms that have responses
  const formsWithResponses = forms.filter((form) => form.responseCount > 0);

  // Filter by date
  const filteredForms = formsWithResponses.filter((form) => {
    // Search filter
    const searchMatch =
      form.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Date filter (simplified - you'd need actual response timestamps)
    let dateMatch = true;
    if (filterBy !== "all") {
      // This would need actual response data to filter properly
      // For now, we'll just show all
      dateMatch = true;
    }

    return searchMatch && dateMatch;
  });

  // Calculate total statistics
  const totalResponses = forms.reduce(
    (sum, form) => sum + (form.responseCount || 0),
    0
  );
  const publishedForms = forms.filter((f) => f.status === "published").length;
  const avgResponsesPerForm =
    formsWithResponses.length > 0
      ? Math.round(totalResponses / formsWithResponses.length)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">All Responses</h1>
        <p className="text-gray-400">
          View and analyze responses from all your forms
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Responses */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-green-400 text-sm font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {totalResponses}
          </h3>
          <p className="text-gray-400 text-sm">Total Responses</p>
        </div>

        {/* Forms with Responses */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {formsWithResponses.length}
          </h3>
          <p className="text-gray-400 text-sm">Forms with Responses</p>
        </div>

        {/* Average Responses */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {avgResponsesPerForm}
          </h3>
          <p className="text-gray-400 text-sm">Avg per Form</p>
        </div>

        {/* Response Rate */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">
            {publishedForms}
          </h3>
          <p className="text-gray-400 text-sm">Published Forms</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search forms..."
            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter and Export */}
        <div className="flex items-center gap-3">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Export All</span>
          </button>
        </div>
      </div>

      {/* Forms List */}
      {filteredForms.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No responses yet
          </h3>
          <p className="text-gray-400 mb-6">
            Responses will appear here once people start filling your forms
          </p>
          <Link
            href="/forms"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            View My Forms
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredForms.map((form) => (
            <Link
              key={form.id}
              href={`/forms/${form.id}/responses`}
              className="block bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-purple-500/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Form Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors truncate">
                    {form.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-1">
                    {form.description || "No description"}
                  </p>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-white font-semibold">
                        {form.responseCount || 0}
                      </span>
                      <span>responses</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>{form.fields?.length || 0} fields</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>
                        Updated{" "}
                        {form.updatedAt
                          ? format(
                              typeof form.updatedAt === "string"
                                ? new Date(form.updatedAt)
                                : form.updatedAt.toDate(),
                              "MMM d, yyyy"
                            )
                          : "recently"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Response Count Badge */}
                <div className="flex flex-col items-end gap-2">
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
                    <div className="text-2xl font-bold text-white">
                      {form.responseCount || 0}
                    </div>
                    <div className="text-xs text-gray-400">Responses</div>
                  </div>
                  <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                    View Details
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination placeholder */}
      {filteredForms.length > 10 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
            Previous
          </button>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-lg transition-colors ${
                  page === 1
                    ? "bg-purple-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

// app/(dashboard)/forms/[id]/responses/page.js - COMPLETE
"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getFormById } from "@/lib/services/formService";
import {
  getFormResponses,
  deleteResponse,
} from "@/lib/services/responseService";
import { ArrowLeft, Loader2, Search, Download } from "lucide-react";
import toast from "react-hot-toast";

// Import components
import ResponseStatsCards from "@/components/responses/ResponseStatsCards";
import ResponseTable from "@/components/responses/ResponseTable";
import ResponseDetailModal from "@/components/responses/ResponseDetailModal";
import ExportCSVButton from "@/components/responses/ExportCSVButton";

export default function ResponsesPage({ params }) {
  const unwrappedParams = use(params);
  const formId = unwrappedParams.id;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // State
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [filteredResponses, setFilteredResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedResponseIndex, setSelectedResponseIndex] = useState(0);

  // Load form and responses
  useEffect(() => {
    const loadData = async () => {
      if (!user || authLoading) return;

      try {
        setLoading(true);

        // Load form
        const formData = await getFormById(formId);
        if (!formData) {
          toast.error("Form not found");
          router.push("/dashboard");
          return;
        }

        // Check ownership
        if (formData.userId !== user.uid) {
          toast.error("You do not have access to this form");
          router.push("/dashboard");
          return;
        }

        setForm(formData);

        // Load responses
        const responsesData = await getFormResponses(formId);
        setResponses(responsesData);
        setFilteredResponses(responsesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load responses");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [formId, user, authLoading, router]);

  // Filter responses
  useEffect(() => {
    let filtered = [...responses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((response) => {
        const searchLower = searchQuery.toLowerCase();

        if (response.metadata?.userName?.toLowerCase().includes(searchLower))
          return true;
        if (response.metadata?.userEmail?.toLowerCase().includes(searchLower))
          return true;

        const answersString = JSON.stringify(response.answers).toLowerCase();
        if (answersString.includes(searchLower)) return true;

        return false;
      });
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((response) => {
        if (!response.submittedAt) return false;

        const responseDate = new Date(response.submittedAt);
        const diffInDays = Math.floor(
          (now - responseDate) / (1000 * 60 * 60 * 24)
        );

        switch (dateFilter) {
          case "today":
            return diffInDays === 0;
          case "week":
            return diffInDays <= 7;
          case "month":
            return diffInDays <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredResponses(filtered);
  }, [searchQuery, dateFilter, responses]);

  // Calculate statistics for ResponseStatsCards
  const calculateStats = () => {
    if (responses.length === 0) {
      return {
        total: 0,
        responseRate: 0,
        avgCompletionTime: "N/A",
        lastResponse: null,
      };
    }

    // Get last response date
    const sortedByDate = [...responses].sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt) : new Date(0);
      const dateB = b.submittedAt ? new Date(b.submittedAt) : new Date(0);
      return dateB - dateA;
    });
    const lastResponse = sortedByDate[0]?.submittedAt
      ? new Date(sortedByDate[0].submittedAt)
      : null;

    // Calculate average completion time
    const timesWithValues = responses.filter(
      (r) => r.completionTime && r.completionTime > 0
    );
    let avgTime = "N/A";
    if (timesWithValues.length > 0) {
      const totalSeconds = timesWithValues.reduce(
        (acc, r) => acc + r.completionTime,
        0
      );
      const avgSeconds = Math.round(totalSeconds / timesWithValues.length);
      const minutes = Math.floor(avgSeconds / 60);
      const seconds = avgSeconds % 60;
      avgTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }

    // Response rate (if viewCount exists on form)
    const responseRate =
      form?.viewCount && form.viewCount > 0
        ? Math.round((responses.length / form.viewCount) * 100)
        : 0;

    return {
      total: responses.length,
      responseRate,
      avgCompletionTime: avgTime,
      lastResponse,
    };
  };

  const stats = calculateStats();

  // Handle response deletion
  const handleDeleteResponse = async (responseId) => {
    try {
      await deleteResponse(responseId, formId);

      setResponses((prev) => prev.filter((r) => r.id !== responseId));
      setFilteredResponses((prev) => prev.filter((r) => r.id !== responseId));

      if (selectedResponse?.id === responseId) {
        setSelectedResponse(null);
      }

      toast.success("Response deleted successfully");
    } catch (error) {
      console.error("Error deleting response:", error);
      toast.error("Failed to delete response");
    }
  };

  // Handle view response details
  const handleViewResponse = (response) => {
    const index = filteredResponses.findIndex((r) => r.id === response.id);
    setSelectedResponseIndex(index);
    setSelectedResponse(response);
  };

  // Navigate between responses in modal
  const handleNext = () => {
    if (selectedResponseIndex < filteredResponses.length - 1) {
      const newIndex = selectedResponseIndex + 1;
      setSelectedResponseIndex(newIndex);
      setSelectedResponse(filteredResponses[newIndex]);
    }
  };

  const handlePrevious = () => {
    if (selectedResponseIndex > 0) {
      const newIndex = selectedResponseIndex - 1;
      setSelectedResponseIndex(newIndex);
      setSelectedResponse(filteredResponses[newIndex]);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading responses...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{form.title}</h1>
                <p className="text-sm text-gray-400">
                  View and manage responses
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ExportCSVButton
                formId={formId}
                formFields={form.fields}
                formTitle={form.title}
              />

              <button
                onClick={() => router.push(`/forms/${formId}/edit`)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg 
                         transition-colors text-sm border border-white/10"
              >
                Edit Form
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <ResponseStatsCards stats={stats} />

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or answer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-purple-500/50 transition-all"
            />
          </div>

          {/* Date Filter */}
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "All Time" },
              { value: "today", label: "Today" },
              { value: "week", label: "This Week" },
              { value: "month", label: "This Month" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setDateFilter(filter.value)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  dateFilter === filter.value
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-400">
          Showing{" "}
          <span className="text-white font-semibold">
            {filteredResponses.length}
          </span>{" "}
          of{" "}
          <span className="text-white font-semibold">{responses.length}</span>{" "}
          responses
        </div>

        {/* Response Table or Empty State */}
        {responses.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No responses yet
            </h3>
            <p className="text-gray-400 mb-6">
              Share your form to start collecting responses
            </p>
            <button
              onClick={() => router.push(`/forms/${formId}/edit`)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                       font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Go to Form Editor
            </button>
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">
              No matching responses
            </h3>
            <p className="text-gray-400">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <ResponseTable
            responses={filteredResponses}
            onViewResponse={handleViewResponse}
            onDeleteResponse={handleDeleteResponse}
          />
        )}
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <ResponseDetailModal
          response={selectedResponse}
          formFields={form.fields}
          onClose={() => setSelectedResponse(null)}
          onDelete={handleDeleteResponse}
          onNext={handleNext}
          onPrevious={handlePrevious}
          hasNext={selectedResponseIndex < filteredResponses.length - 1}
          hasPrevious={selectedResponseIndex > 0}
        />
      )}
    </div>
  );
}

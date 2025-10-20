// app/(dashboard)/forms/page.js
"use client";
import { useState } from "react";
import { useForms } from "@/lib/hooks/useForms";
import { useAuth } from "@/context/AuthContext";
import FormCard from "@/components/dashboard/FormCard";
import CreateFormCard from "@/components/dashboard/CreateFormCard";
import FilterTabs from "@/components/dashboard/FilterTabs";
import EmptyState from "@/components/dashboard/EmptyState";
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  Loader2,
} from "lucide-react";

export default function MyFormsPage() {
  const { user } = useAuth();
  const { forms, loading } = useForms(user?.uid);
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to safely parse dates
  const parseDate = (dateValue) => {
    if (!dateValue) return 0;

    try {
      // Handle Firestore Timestamp objects
      if (dateValue?.toDate && typeof dateValue.toDate === "function") {
        return dateValue.toDate().getTime();
      }

      // Handle regular dates
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      const timestamp = date.getTime();
      return isNaN(timestamp) ? 0 : timestamp;
    } catch (error) {
      console.error("Error parsing date:", error);
      return 0;
    }
  };

  // Calculate counts for filter tabs
  const counts = {
    all: forms.length,
    draft: forms.filter((f) => f.status === "draft").length,
    published: forms.filter((f) => f.status === "published").length,
    archived: forms.filter((f) => f.status === "archived").length,
  };

  // Filter forms based on active tab
  const filteredForms = forms.filter((form) => {
    // Filter by status
    let statusMatch = true;
    if (activeFilter === "draft") statusMatch = form.status === "draft";
    if (activeFilter === "published") statusMatch = form.status === "published";
    if (activeFilter === "archived") statusMatch = form.status === "archived";

    // Filter by search query
    const searchMatch =
      form.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Sort forms
  const sortedForms = [...filteredForms].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.title || "").localeCompare(b.title || "");
      case "created":
        return parseDate(b.createdAt) - parseDate(a.createdAt);
      case "responses":
        return (b.responseCount || 0) - (a.responseCount || 0);
      case "updated":
      default:
        return parseDate(b.updatedAt) - parseDate(a.updatedAt);
    }
  });

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Forms</h1>
        <p className="text-gray-400">
          Manage and organize all your forms in one place
        </p>
      </div>

      {/* Search and Controls Bar */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search forms by title or description..."
            className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none px-4 py-2 pr-8 bg-gradient-to-r from-purple-800/40 to-indigo-700/40 border border-purple-500/20 rounded-lg text-sm text-white shadow-inner hover:border-purple-400/40 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all cursor-pointer"
          >
            <option value="updated" className="bg-slate-800 text-white">
              Last Updated
            </option>
            <option value="created" className="bg-slate-800 text-white">
              Date Created
            </option>
            <option value="name" className="bg-slate-800 text-white">
              Name (A-Z)
            </option>
            <option value="responses" className="bg-slate-800 text-white">
              Most Responses
            </option>
          </select>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-purple-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-purple-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <FilterTabs
          activeTab={activeFilter}
          onTabChange={handleFilterChange}
          tabs={[
            { label: "All Forms", value: "all", count: counts.all },
            { label: "Draft", value: "draft", count: counts.draft },
            { label: "Published", value: "published", count: counts.published },
            { label: "Archived", value: "archived", count: counts.archived },
          ]}
        />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-4">
          <p className="text-gray-400">
            Found{" "}
            <span className="text-white font-semibold">
              {sortedForms.length}
            </span>{" "}
            form
            {sortedForms.length !== 1 ? "s" : ""} matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* Forms Grid/List */}
      {sortedForms.length === 0 && !searchQuery ? (
        <EmptyState
          title="No forms yet"
          description="Create your first form to get started with FormCraft"
          actionText="Create New Form"
          actionHref="/forms/new"
        />
      ) : sortedForms.length === 0 && searchQuery ? (
        <EmptyState
          title="No forms found"
          description={`No forms match your search "${searchQuery}"`}
          actionText="Clear Search"
          actionHref="#"
          onActionClick={() => setSearchQuery("")}
        />
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {/* Create New Form Card */}
          {activeFilter === "all" && <CreateFormCard viewMode={viewMode} />}

          {/* Form Cards */}
          {sortedForms.map((form) => (
            <FormCard key={form.id} form={form} viewMode={viewMode} />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {sortedForms.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            <div>
              <span className="text-white font-semibold">
                {sortedForms.length}
              </span>{" "}
              form{sortedForms.length !== 1 ? "s" : ""} shown
            </div>
            <div>
              <span className="text-white font-semibold">
                {sortedForms.reduce(
                  (sum, f) => sum + (f.responseCount || 0),
                  0
                )}
              </span>{" "}
              total responses
            </div>
            <div>
              <span className="text-white font-semibold">
                {counts.published}
              </span>{" "}
              published
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

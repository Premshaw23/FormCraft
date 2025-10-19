"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useForms } from "@/lib/hooks/useForms";
import {
  FileText,
  CheckCircle,
  BarChart3,
  FileEdit,
  Loader2,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import FilterTabs from "@/components/dashboard/FilterTabs";
import CreateFormCard from "@/components/dashboard/CreateFormCard";
import FormCard from "@/components/dashboard/FormCard";
import EmptyState from "@/components/dashboard/EmptyState";

export default function DashboardPage() {
  const { user } = useAuth();
  const { forms, loading, stats, deleteForm, duplicateForm } = useForms();

  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  const {
    total = 0,
    published = 0,
    drafts = 0,
    archived = 0,
    totalResponses = 0,
  } = stats || {};

  // Filter forms based on active filter
  const filteredForms = forms.filter((form) => {
    if (activeFilter === "all") return true;
    return form.status === activeFilter;
  });

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

  // Sort filtered forms
  const sortedForms = [...filteredForms].sort((a, b) => {
    const nameA = a?.name?.toString().toLowerCase() || "";
    const nameB = b?.name?.toString().toLowerCase() || "";

    switch (sortBy) {
      case "created":
        return parseDate(b?.createdAt) - parseDate(a?.createdAt);
      case "name":
        return nameA.localeCompare(nameB);
      case "responses":
        return (b?.responseCount || 0) - (a?.responseCount || 0);
      case "updated":
      default:
        return parseDate(b?.updatedAt) - parseDate(a?.updatedAt);
    }
  });

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back,{" "}
            {user?.displayName || user?.email?.split("@")[0] || "User"}! Here's
            what's happening with your forms.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Forms"
            value={total}
            icon={FileText}
            trend="up"
            trendValue={12}
            gradient="from-blue-500 to-cyan-500"
          />
          <StatsCard
            title="Published"
            value={published}
            icon={CheckCircle}
            trend="up"
            trendValue={8}
            gradient="from-green-500 to-emerald-500"
          />
          <StatsCard
            title="Total Responses"
            value={totalResponses}
            icon={BarChart3}
            trend="up"
            trendValue={23}
            gradient="from-purple-500 to-pink-500"
          />
          <StatsCard
            title="Drafts"
            value={drafts}
            icon={FileEdit}
            gradient="from-yellow-500 to-orange-500"
          />
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && forms.length > 0 && (
        <FilterTabs
          activeTab={activeFilter}
          onTabChange={handleFilterChange}
          tabs={[
            { label: "All Forms", value: "all", count: total },
            { label: "Draft", value: "draft", count: drafts },
            { label: "Published", value: "published", count: published },
            { label: "Archived", value: "archived", count: archived },
          ]}
        />
      )}

      {/* Sort & View Options */}
      {!loading && forms.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            Showing {filteredForms.length} of {total} forms
          </p>

          <div className="flex items-center space-x-4">
            <label
              htmlFor="sort-select"
              className="text-sm text-gray-400 hidden sm:block"
            >
              Sort By:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                aria-label="Sort forms"
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
                  Name (A–Z)
                </option>
                <option value="responses" className="bg-slate-800 text-white">
                  Most Responses
                </option>
              </select>

              {/* Custom dropdown arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Forms Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading your forms...</p>
            </div>
          </div>
        ) : forms.length === 0 ? (
          <EmptyState />
        ) : filteredForms.length === 0 ? (
          <EmptyState
            title={`No ${activeFilter} forms`}
            description={`You don't have any ${activeFilter} forms yet`}
            actionLabel="Create New Form"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreateFormCard />
            {sortedForms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onDelete={deleteForm}
                onDuplicate={duplicateForm}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

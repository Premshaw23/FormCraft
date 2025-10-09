"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Grid3x3,
  List as ListIcon,
  Eye,
  Edit3,
  Share2,
  MoreVertical,
  Copy,
  Archive,
  Trash2,
  Calendar,
  BarChart3,
  FileText,
  Clock,
  CheckCircle2,
  Download,
} from "lucide-react";

export default function ListFormContent() {
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [activeTab, setActiveTab] = useState("all"); // all, draft, published, archived
  const [selectedForms, setSelectedForms] = useState([]);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const sampleForms = [
    {
      id: 1,
      title: "Customer Feedback Survey",
      description: "Collect customer satisfaction ratings",
      status: "published",
      fields: 8,
      responses: 156,
      lastEdited: "2 hours ago",
      createdAt: "Jan 15, 2025",
      thumbnail: "feedback",
    },
    {
      id: 2,
      title: "Event Registration Form",
      description: "Register attendees for upcoming conference",
      status: "published",
      fields: 12,
      responses: 89,
      lastEdited: "1 day ago",
      createdAt: "Jan 10, 2025",
      thumbnail: "event",
    },
    {
      id: 3,
      title: "Job Application Form",
      description: "Collect applications for open positions",
      status: "draft",
      fields: 15,
      responses: 0,
      lastEdited: "3 hours ago",
      createdAt: "Jan 8, 2025",
      thumbnail: "job",
    },
    {
      id: 4,
      title: "Product Order Form",
      description: "Process product orders and payments",
      status: "published",
      fields: 10,
      responses: 234,
      lastEdited: "5 days ago",
      createdAt: "Dec 28, 2024",
      thumbnail: "order",
    },
    {
      id: 5,
      title: "Contact Us Form",
      description: "General inquiries and support requests",
      status: "draft",
      fields: 6,
      responses: 0,
      lastEdited: "1 week ago",
      createdAt: "Dec 20, 2024",
      thumbnail: "contact",
    },
    {
      id: 6,
      title: "Newsletter Subscription",
      description: "Subscribe users to weekly newsletter",
      status: "published",
      fields: 4,
      responses: 567,
      lastEdited: "2 weeks ago",
      createdAt: "Dec 15, 2024",
      thumbnail: "newsletter",
    },
  ];

  const tabs = [
    { id: "all", label: "All Forms", count: 24 },
    { id: "draft", label: "Draft", count: 6 },
    { id: "published", label: "Published", count: 18 },
    { id: "archived", label: "Archived", count: 0 },
  ];

  const filteredForms = sampleForms.filter((form) => {
    const matchesTab = activeTab === "all" || form.status === activeTab;
    const matchesSearch = form.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      published: "bg-green-500/20 text-green-400 border-green-500/30",
      draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      archived: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    };
    return styles[status] || styles.draft;
  };

  const toggleFormSelection = (formId) => {
    setSelectedForms((prev) =>
      prev.includes(formId)
        ? prev.filter((id) => id !== formId)
        : [...prev, formId]
    );
  };

  const getThumbnailGradient = (thumbnail) => {
    const gradients = {
      feedback: "from-purple-500 to-pink-500",
      event: "from-blue-500 to-cyan-500",
      job: "from-green-500 to-emerald-500",
      order: "from-orange-500 to-red-500",
      contact: "from-indigo-500 to-purple-500",
      newsletter: "from-yellow-500 to-orange-500",
    };
    return gradients[thumbnail] || gradients.feedback;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">All Forms</h1>
          <p className="text-gray-400">
            Manage and organize all your forms in one place
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 transition-all">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* View Mode & Filter */}
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 transition-all">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter</span>
          </button>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-all ${
                viewMode === "grid"
                  ? "bg-purple-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-all ${
                viewMode === "list"
                  ? "bg-purple-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "text-white"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            {tab.label}
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-white/5 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            )}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedForms.length > 0 && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-white font-medium">
              {selectedForms.length} form{selectedForms.length > 1 ? "s" : ""}{" "}
              selected
            </span>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Clear selection
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-all">
              Archive
            </button>
            <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm text-red-400 transition-all">
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Forms Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForms.map((form) => (
            <div
              key={form.id}
              className={`group bg-white/5 backdrop-blur-sm border rounded-xl p-5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer ${
                selectedForms.includes(form.id)
                  ? "border-purple-500/50 bg-purple-500/10"
                  : "border-white/10"
              }`}
              onClick={() => toggleFormSelection(form.id)}
            >
              {/* Thumbnail */}
              <div
                className={`w-full h-32 bg-gradient-to-br ${getThumbnailGradient(
                  form.thumbnail
                )} rounded-lg mb-4 flex items-center justify-center`}
              >
                <FileText className="w-12 h-12 text-white/50" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1 line-clamp-1">
                      {form.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {form.description}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(
                      form.status
                    )}`}
                  >
                    {form.status}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>{form.fields} fields</span>
                  <span>•</span>
                  <span>{form.responses} responses</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-gray-500">
                    Edited {form.lastEdited}
                  </span>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Form Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Responses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Edited
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredForms.map((form) => (
                <tr
                  key={form.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {form.title}
                      </div>
                      <div className="text-sm text-gray-400">
                        {form.fields} fields
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(
                        form.status
                      )}`}
                    >
                      {form.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {form.responses}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {form.lastEdited}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 hover:bg-white/10 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded transition-colors">
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredForms.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No forms found
          </h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}

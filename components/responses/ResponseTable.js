// components/responses/ResponseTable.jsx
"use client";
import React, { useState } from "react";
import { Eye, Trash2, User, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

const ResponseTable = ({ responses, onViewResponse, onDeleteResponse }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(responses.map((r) => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Helper function to safely format date
  const formatSubmittedDate = (submittedAt) => {
    if (!submittedAt) return "N/A";

    try {
      // Convert to Date object if it's a string or timestamp
      const date =
        submittedAt instanceof Date ? submittedAt : new Date(submittedAt);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return format(date, "MMM dd, yyyy h:mm a");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  if (responses.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Responses Yet
        </h3>
        <p className="text-gray-400">
          Responses will appear here once someone fills out your form.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
      {/* Table Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedRows.length === responses.length}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-gray-600 bg-slate-700 
                         text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-400">
              {selectedRows.length > 0
                ? `${selectedRows.length} selected`
                : `${responses.length} responses`}
            </span>
          </div>

          {selectedRows.length > 0 && (
            <button
              onClick={() => {
                if (confirm(`Delete ${selectedRows.length} responses?`)) {
                  selectedRows.forEach((id) => onDeleteResponse(id));
                  setSelectedRows([]);
                }
              }}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 
                         rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Select
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Respondent
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Email
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Submitted
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr
                key={response.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(response.id)}
                    onChange={() => handleSelectRow(response.id)}
                    className="w-4 h-4 rounded border-gray-600 bg-slate-700 
                               text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 
                                    rounded-full flex items-center justify-center text-white font-semibold"
                    >
                      {response.metadata?.userName?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {response.metadata?.userName || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {response.id.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="w-4 h-4" />
                    {response.metadata?.userEmail || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatSubmittedDate(response.submittedAt)}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                   bg-green-500/10 text-green-400 border border-green-500/20"
                  >
                    Completed
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewResponse(response)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                      title="View Response"
                    >
                      <Eye className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this response?")) {
                          onDeleteResponse(response.id);
                        }
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                      title="Delete Response"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseTable;

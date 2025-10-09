"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Calendar,
  Users,
  Eye,
  MessageSquare,
} from "lucide-react";

export default function CheckResponsesContent() {
  const [selectedForm, setSelectedForm] = useState("all");
  const [dateRange, setDateRange] = useState("7days");

  const forms = [
    { id: "all", name: "All Forms" },
    { id: "1", name: "Customer Feedback Survey" },
    { id: "2", name: "Event Registration Form" },
    { id: "3", name: "Product Order Form" },
  ];

  const responses = [
    {
      id: 1,
      form: "Customer Feedback Survey",
      respondent: "John Doe",
      email: "john@example.com",
      submittedAt: "2 hours ago",
      rating: 5,
    },
    {
      id: 2,
      form: "Event Registration Form",
      respondent: "Jane Smith",
      email: "jane@example.com",
      submittedAt: "5 hours ago",
      rating: 4,
    },
    {
      id: 3,
      form: "Product Order Form",
      respondent: "Bob Johnson",
      email: "bob@example.com",
      submittedAt: "1 day ago",
      rating: 5,
    },
  ];

  const stats = [
    {
      label: "Total Responses",
      value: "1,234",
      change: "+23%",
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Avg. Completion Time",
      value: "2m 34s",
      change: "-12%",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Unique Respondents",
      value: "987",
      change: "+18%",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Completion Rate",
      value: "87.3%",
      change: "+5%",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Responses</h1>
          <p className="text-gray-400">View and analyze form submissions</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all">
          <Download className="w-4 h-4" />
          <span>Export All</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {forms.map((form) => (
            <option key={form.id} value={form.id}>
              {form.name}
            </option>
          ))}
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="all">All time</option>
        </select>

        <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-300 transition-all">
          <Filter className="w-4 h-4" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Responses Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Form
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Respondent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {responses.map((response) => (
                <tr
                  key={response.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {response.form}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {response.respondent}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {response.email}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < response.rating
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {response.submittedAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded transition-colors">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

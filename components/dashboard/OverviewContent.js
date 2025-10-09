"use client";

import {
  TrendingUp,
  Users,
  FileText,
  Eye,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function OverviewContent({ user }) {
  const stats = [
    {
      label: "Total Forms",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: FileText,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Total Responses",
      value: "1,234",
      change: "+23%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Views",
      value: "5,678",
      change: "+8%",
      trend: "up",
      icon: Eye,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Conversion Rate",
      value: "21.7%",
      change: "-2%",
      trend: "down",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentForms = [
    {
      id: 1,
      title: "Customer Feedback Survey",
      status: "published",
      responses: 156,
      lastActivity: "2 hours ago",
    },
    {
      id: 2,
      title: "Event Registration Form",
      status: "published",
      responses: 89,
      lastActivity: "1 day ago",
    },
    {
      id: 3,
      title: "Job Application Form",
      status: "draft",
      responses: 0,
      lastActivity: "3 hours ago",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "New response received",
      form: "Customer Feedback Survey",
      time: "5 minutes ago",
      type: "response",
    },
    {
      id: 2,
      action: "Form published",
      form: "Event Registration Form",
      time: "2 hours ago",
      type: "publish",
    },
    {
      id: 3,
      action: "Form edited",
      form: "Job Application Form",
      time: "3 hours ago",
      type: "edit",
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "response":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "publish":
        return <Eye className="w-5 h-5 text-blue-400" />;
      case "edit":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.displayName?.split(" ")[0] || "User"}! 👋
        </h1>
        <p className="text-gray-400">
          Here's what's happening with your forms today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`flex items-center text-sm font-medium ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <ArrowUpRight
                    className={`w-4 h-4 ${
                      stat.trend === "down" ? "rotate-90" : ""
                    }`}
                  />
                  {stat.change}
                </span>
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

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Forms */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Forms</h2>
            <button className="text-sm text-purple-400 hover:text-purple-300">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentForms.map((form) => (
              <div
                key={form.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="text-white font-medium mb-1">{form.title}</h3>
                  <p className="text-sm text-gray-400">
                    {form.responses} responses • {form.lastActivity}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full border ${
                    form.status === "published"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                  }`}
                >
                  {form.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.form}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
            <FileText className="w-6 h-6 text-purple-400" />
            <div className="text-left">
              <p className="text-white font-medium">Create New Form</p>
              <p className="text-xs text-gray-400">Start from scratch</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
            <Eye className="w-6 h-6 text-blue-400" />
            <div className="text-left">
              <p className="text-white font-medium">View Analytics</p>
              <p className="text-xs text-gray-400">Check performance</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition-all">
            <Users className="w-6 h-6 text-green-400" />
            <div className="text-left">
              <p className="text-white font-medium">Export Responses</p>
              <p className="text-xs text-gray-400">Download data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

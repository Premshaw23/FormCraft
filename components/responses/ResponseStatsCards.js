// components/responses/ResponseStatsCards.jsx
"use client";
import React from "react";
import { Users, TrendingUp, Clock, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ResponseStatsCards = ({ stats }) => {
  // Helper function to safely format date
  const formatLastResponse = (lastResponse) => {
    if (!lastResponse) return "No responses yet";

    try {
      // Convert to Date object if it's a string
      const date =
        lastResponse instanceof Date ? lastResponse : new Date(lastResponse);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const cards = [
    {
      title: "Total Responses",
      value: stats.total || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      title: "Response Rate",
      value: stats.responseRate ? `${stats.responseRate}%` : "N/A",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
    },
    {
      title: "Avg Completion Time",
      value: stats.avgCompletionTime || "N/A",
      icon: Clock,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
    },
    {
      title: "Last Response",
      value: formatLastResponse(stats.lastResponse),
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 
                     hover:border-purple-500/30 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
          <p className="text-sm text-gray-400">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

export default ResponseStatsCards;

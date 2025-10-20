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
      // Handle various date formats
      let date;

      if (lastResponse instanceof Date) {
        date = lastResponse;
      } else if (
        typeof lastResponse === "string" ||
        typeof lastResponse === "number"
      ) {
        date = new Date(lastResponse);
      } else if (lastResponse._seconds) {
        // Handle Firestore Timestamp
        date = new Date(lastResponse._seconds * 1000);
      } else if (lastResponse.seconds) {
        // Handle Firestore Timestamp alternative format
        date = new Date(lastResponse.seconds * 1000);
      } else if (
        lastResponse.toDate &&
        typeof lastResponse.toDate === "function"
      ) {
        // Handle Firestore Timestamp with toDate method
        date = lastResponse.toDate();
      } else {
        console.warn("Unhandled date format:", lastResponse);
        return "Invalid date format";
      }

      // Check if date is valid
      if (!date || isNaN(date.getTime())) {
        console.warn("Invalid date value:", lastResponse);
        return "Invalid date";
      }

      // Additional check for unrealistic dates
      const year = date.getFullYear();
      if (year < 2000 || year > 2100) {
        console.warn("Date outside realistic range:", date);
        return "Invalid date";
      }

      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error, lastResponse);
      return "Invalid date";
    }
  };

  const cards = [
    {
      title: "Total Responses",
      value: stats?.total || 0,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      title: "Response Rate",
      value: stats?.responseRate ? `${stats.responseRate}%` : "N/A",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
    },
    {
      title: "Avg Completion Time",
      value: stats?.avgCompletionTime || "N/A",
      icon: Clock,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
    },
    {
      title: "Last Response",
      value: formatLastResponse(stats?.lastResponse),
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
                     hover:border-purple-500/30 transition-all duration-300"
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

// components/dashboard/StatsCard.jsx
"use client";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  gradient,
}) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Trend Badge */}
        {trend && trendValue && (
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
              isPositive
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{trendValue}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-1">
        <div className="text-3xl font-bold text-white">{value}</div>
      </div>

      {/* Title */}
      <div className="text-sm text-gray-400">{title}</div>

      {/* Mini Progress Bar (Optional Visual) */}
      <div className="mt-4 w-full bg-white/5 rounded-full h-1 overflow-hidden">
        <div
          className={`h-1 bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000`}
          style={{ width: "70%" }}
        ></div>
      </div>
    </div>
  );
}

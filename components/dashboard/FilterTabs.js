"use client";

export default function FilterTabs({ activeTab, onTabChange, tabs }) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-700/30 scrollbar-track-transparent">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`
              relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
              border border-transparent
              whitespace-nowrap
              ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500/40 shadow-md shadow-purple-600/30"
                  : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10"
              }
              focus:outline-none
            `}
          >
            <span>{tab.label}</span>

            {tab.count > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-gray-400 group-hover:bg-white/20"
                  }`}
              >
                {tab.count}
              </span>
            )}

            {/* Active gradient underline */}
            {isActive && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

import React, { useState } from "react";

const activities = [
  {
    id: 1,
    user: "Gina May Lada",
    action: "started the task",
    task: "Frontend",
    time: "10m ago",
    type: "started",
  },
  {
    id: 2,
    user: "Sam",
    action: "completed the task",
    task: "API Integration",
    time: "1h ago",
    type: "completed",
  },
  {
    id: 3,
    user: "Sam",
    action: "completed the task",
    task: "API Integration",
    time: "1h ago",
    type: "completed",
  },
  {
    id: 4,
    user: "Sam",
    action: "completed the task",
    task: "API Integration",
    time: "1h ago",
    type: "completed",
  },
  {
    id: 5,
    user: "Aarnt McVenenn",
    action: "has an overdue task",
    task: "Database Schema",
    time: "2 days ago",
    type: "overdue",
  },
  {
    id: 6,
    user: "Canmta Limd",
    action: "has an overdue task",
    task: "UI Review",
    time: "3 days ago",
    type: "overdue",
  },
  {
    id: 7,
    user: "Daniet Ruan",
    action: "missed the deadline",
    task: "Backend Integration",
    time: "5 days ago",
    type: "overdue",
  },
];

export const WhosWorking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [liveMode, setLiveMode] = useState(false);

  const filtered =
    activeTab === "overdue"
      ? activities.filter((a) => a.type === "overdue")
      : activities;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 dark:bg-gray-800 dark:border-gray-700">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">
          Who's Working on What
        </h2>
        <button
          onClick={() => setLiveMode((prev) => !prev)}
          className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
            liveMode ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
              liveMode ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { key: "all", label: "All Activity" },
          { key: "overdue", label: "Overdue Alerts" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors duration-150 ${
              activeTab === key
                ? "bg-white text-gray-800 shadow-sm dark:bg-gray-600 dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Activity List ── */}
      <ul className="space-y-3">
        {filtered.length === 0 ? (
          <li className="text-sm text-gray-400 text-center py-4">
            No activity found.
          </li>
        ) : (
          filtered.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              {/* Icon dot */}
              <span
                className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  item.type === "overdue" ? "border-red-500" : "border-blue-500"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.type === "overdue" ? "bg-red-500" : "bg-blue-500"
                  }`}
                />
              </span>

              {/* Text */}
              <div>
                <p
                  className={`text-sm dark:text-gray-300 ${
                    item.type === "overdue" ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {item.user}
                  </span>{" "}
                  {item.action}{" "}
                  <span className="font-semibold text-gray-800 dark:text-white">
                    — {item.task}
                  </span>
                </p>
                <span className="text-xs text-gray-400 mt-0.5 block">
                  {item.time}
                </span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

import React, { useState } from "react";

const tasks = [
  {
    id: 1,
    title: "Update landing page copy",
    priority: "High",
    status: "Doing",
  },
  {
    id: 2,
    title: "Review pull request #42",
    priority: "High",
    status: "To do",
  },
  {
    id: 3,
    title: "Write unit tests for auth",
    priority: "Med",
    status: "To do",
  },
  {
    id: 4,
    title: "Prepare Q2 report slides",
    priority: "Med",
    status: "Doing",
  },
  {
    id: 5,
    title: "Set up staging environment",
    priority: "Low",
    status: "Done",
  },
  { id: 6, title: "Fix login redirect bug", priority: "High", status: "Done" },
];

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "text-red-600 dark:text-red-400";
    case "Med":
      return "text-amber-600 dark:text-amber-400";
    case "Low":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-gray-600";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Done":
      return "text-green-600 dark:text-green-400";
    case "Doing":
      return "text-blue-600 dark:text-blue-400";
    case "To do":
      return "text-blue-500 dark:text-blue-300";
    default:
      return "text-gray-600";
  }
};

export const MyTask = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [checkedTasks, setCheckedTasks] = useState(new Set());

  const filteredTasks =
    activeTab === "All"
      ? tasks
      : tasks.filter((task) => task.status === activeTab);

  const toggleCheck = (id) => {
    const newChecked = new Set(checkedTasks);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedTasks(newChecked);
  };

  const tabs = ["All", "To do", "Doing", "Done"];

  return (
    <>
      {/* <div id="mytask" className="h-12"></div> */}
      <div className="bg-white dark:bg-gray-900 rounded-lg mb-4">
        <span className="block text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-6 px-4">
          My Tasks
        </span>
        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 dark:border-gray-700 px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-gray-900 dark:text-white border-blue-500"
                  : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task Table */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="w-12 px-6 py-4"></th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                  Task name
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={checkedTasks.has(task.id)}
                      onChange={() => toggleCheck(task.id)}
                      className="w-4 h-4 rounded cursor-pointer"
                    />
                  </td>
                  <td
                    className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${
                      task.status === "Done"
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : ""
                    }`}
                  >
                    {task.title}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-medium ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-sm font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

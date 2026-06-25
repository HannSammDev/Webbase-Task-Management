import React, { useState, useEffect } from "react";
import { db } from "../../Config/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

import { useAuth } from "../../Auth/AuthContex";

const getPriorityBadge = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
      };
    case "medium":
    case "med":
      return {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-300",
      };
    case "low":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
      };
  }
};

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "Completed":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
      };
    case "in-progress":
    case "in progress":
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
        dotColor: "bg-blue-500",
      };
    case "review":
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        dotColor: "bg-yellow-500",
      };
    case "pending":
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
      };
    case "overdue":
      return {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
        dotColor: "bg-red-500",
      };
    case "todo":
    case "to do":
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
        dotColor: "bg-gray-400",
      };
    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-700 dark:text-gray-300",
      };
  }
};

// Get status icon color for dropdown
const getStatusDotColor = (status) => {
  switch (status?.toLowerCase()) {
    case "to do":
      return "bg-gray-400";
    case "in progress":
    case "in-progress":
      return "bg-blue-500";
    case "review":
      return "bg-yellow-500";
    case "overdue":
      return "bg-red-500";
    case "completed":
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
};

const formatDate = (date) => {
  if (!date) return "";
  if (date.toDate)
    return date.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  if (typeof date === "string")
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  return "";
};

export const MyTask = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [checkedTasks, setCheckedTasks] = useState(new Set());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); // Track which task's dropdown is open

  // Available status options for tasks
  const statusOptions = ["To do", "In Progress", "Review", "Completed"];

  // Filter tasks based on the active tab
  const filteredTasks =
    activeTab === "All"
      ? tasks
      : tasks.filter((task) => {
          // Normalize task status: convert to lowercase, remove spaces and hyphens
          // This handles variations like "todo", "To do", "in-progress", "In Progress", etc.
          const taskStatus = task.status
            ?.toLowerCase()
            .trim()
            .replace(/[\s-]/g, "");

          // Normalize tab name: convert to lowercase, remove spaces and hyphens
          const tabStatus = activeTab
            .toLowerCase()
            .trim()
            .replace(/[\s-]/g, "");

          // Special case: "Doing" tab should match both "doing" and "inprogress" statuses
          if (tabStatus === "doing") {
            return taskStatus === "doing" || taskStatus === "inprogress";
          }

          // For all other tabs, perform a direct match
          return taskStatus === tabStatus;
        });

  const toggleCheck = (id) => {
    const newChecked = new Set(checkedTasks);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedTasks(newChecked);
  };

  // Update task status in Firebase
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { status: newStatus });

      // Update local state immediately for better UX
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );

      setOpenDropdown(null);
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status");
    }
  };

  const tabs = ["All", "To do", "Doing", "Completed"];

  const { user, isAdmin } = useAuth();
  useEffect(() => {
    setLoading(true);

    const tasksRef = collection(db, "tasks");
    const q = isAdmin
      ? query(tasksRef)
      : query(tasksRef, where("assignedTo", "==", user.uid));

    const unsubscribe = onSnapshot(
      q, // 👈 just replace the first two args with just q
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        tasksData.sort(
          (a, b) =>
            b.createdAt?.toDate()?.getTime() - a.createdAt?.toDate()?.getTime(),
        );
        setTasks(tasksData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setError(err.message);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg mb-4 p-6">
        <p className="text-gray-500 dark:text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg mb-4 p-6">
        <p className="text-red-500">Error loading tasks: {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-lg mb-4">
        <span className="block text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-6 px-4">
          My Tasks
        </span>

        {/* Filter Buttons */}
        <div className="flex gap-3 px-6 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
                activeTab === tab
                  ? " text-blue-500 border-blue-500 dark:bg-gray-100 dark:text-gray-900"
                  : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Task Table */}

        <table className="w-full min-w-max table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="w-12 px-6 py-4"></th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Task Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const priorityBadge = getPriorityBadge(task.priority);
                const statusBadge = getStatusBadge(task.status);
                return (
                  <tr
                    key={task.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={checkedTasks.has(task.id)}
                        onChange={() => toggleCheck(task.id)}
                        className="w-4 h-4 rounded cursor-pointer accent-green-600"
                      />
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 ${
                        task.status === "Completed"
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : ""
                      }`}
                    >
                      {task.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${priorityBadge.bg} ${priorityBadge.text}`}
                      >
                        {task.priority || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      {/* Status dropdown button with colored dot icon */}
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === task.id ? null : task.id,
                            )
                          }
                          className={`inline-flex items-center gap-2 px-2 py-1 rounded-3xl text-sm font-medium cursor-pointer transition-all border-1 ${statusBadge.bg} ${statusBadge.text} border-current hover:shadow-md`}
                        >
                          {/* Colored dot icon */}
                          <span
                            className={`w-3 h-3 rounded-full ${getStatusDotColor(task.status)}`}
                          ></span>
                          <span>{task.status || "N/A"}</span>
                          <span className="text-xs">▼</span>
                        </button>

                        {/* Dropdown menu - appears when button is clicked */}
                        {openDropdown === task.id && (
                          <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-max py-1">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  updateTaskStatus(task.id, status)
                                }
                                className="block w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {/* Colored dot for each option */}
                                <span
                                  className={`inline-block w-3 h-3 rounded-full ${getStatusDotColor(status)}`}
                                ></span>
                                <span className="text-gray-700 dark:text-gray-300">
                                  {status}
                                </span>

                                {/* Checkmark for selected status */}
                                {task.status?.toLowerCase() ===
                                  status.toLowerCase() && (
                                  <span className="ml-auto text-green-500">
                                    ✓
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {task.dueDate ? formatDate(task.dueDate) : "No date"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

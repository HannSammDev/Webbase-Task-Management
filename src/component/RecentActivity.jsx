import { Divider } from "primereact/divider";
import React from "react";
import {
  FiCheckCircle,
  FiPlusCircle,
  FiArrowRightCircle,
  FiPlusSquare,
} from "react-icons/fi";

export const RecentActivity = () => {
  return (
    <div className="bg-white border-2 p-4 rounded-lg border-gray-300 dark:border-gray-600 max-h-96 md:max-h-[18rem] overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent activity
        </h2>
      </div>
      <ul className="space-y-4">
        <li className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
          <div className="flex items-start gap-2">
            <FiCheckCircle className="mt-0.5 text-green-500" />
            <span>Juan completed the task</span>
          </div>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            2 hours ago
          </span>
        </li>
        <Divider className="border-gray-300 dark:border-gray-600" />
        <li className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
          <div className="flex items-start gap-2">
            <FiPlusCircle className="mt-0.5 text-blue-500" />
            <span>Juan added the task</span>
          </div>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            1 day ago
          </span>
        </li>
        <Divider className="border-gray-300 dark:border-gray-600" />
        <li className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
          <div className="flex items-start gap-2">
            <FiArrowRightCircle className="mt-0.5 text-yellow-500" />
            <span>Juan moved the task to review</span>
          </div>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            3 days ago
          </span>
        </li>
        <Divider className="border-gray-300 dark:border-gray-600" />
        <li className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
          <div className="flex items-start gap-2">
            <FiPlusSquare className="mt-0.5 text-purple-500" />
            <span>Juan created a new task</span>
          </div>
          <span className="block text-xs text-gray-500 dark:text-gray-400">
            1 week ago
          </span>
        </li>
      </ul>
    </div>
  );
};

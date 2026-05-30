import React from "react";
import {
  FiList,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";

export const Totals = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <div className="col-span-1 flex flex-col justify-start items-start gap-3 bg-white border-2 border-gray-300 rounded-lg dark:border-gray-600 h-auto md:h-40 p-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-blue-500">
          <FiList className="h-6 w-6" />
          <span className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Total Tasks
          </span>
        </div>
        <span className="text-3xl font-bold">10</span>
        <span className="text-xs font-semibold text-gray-500">
          +3 this week
        </span>
      </div>
      <div className="col-span-1 flex flex-col justify-start items-start gap-3 bg-white border-2 border-gray-300 rounded-lg dark:border-gray-600 h-auto md:h-40 p-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-emerald-500">
          <FiCheckCircle className="h-6 w-6" />
          <span className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Completed Tasks
          </span>
        </div>
        <span className="text-3xl font-bold">5</span>
        <span className="text-xs font-semibold text-gray-500">60% rate</span>
      </div>
      <div className="col-span-1 flex flex-col justify-start items-start gap-3 bg-white border-2 border-gray-300 rounded-lg dark:border-gray-600 h-auto md:h-40 p-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-yellow-500">
          <FiClock className="h-6 w-6" />
          <span className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Pending Tasks
          </span>
        </div>
        <span className="text-3xl font-bold">5</span>
        <span className="text-xs font-semibold text-gray-500">6 due today</span>
      </div>
      <div className="col-span-1 flex flex-col justify-start items-start gap-3 bg-white border-2 border-gray-300 rounded-lg dark:border-gray-600 h-auto md:h-40 p-5 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-red-500">
          <FiAlertTriangle className="h-6 w-6" />
          <span className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Overdue Tasks
          </span>
        </div>
        <span className="text-3xl font-bold">2</span>
        <span className="text-xs font-semibold text-red-500">Need action</span>
      </div>
    </div>
  );
};

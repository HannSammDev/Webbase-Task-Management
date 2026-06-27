import React from "react";
import {
  FiList,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import { TeamDirectory } from "./teamDerictory";
import { WhosWorking } from "./twhoseworking";
export const Teams = () => {
  return (
    <>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Team Members
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your team
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150">
          <span>+</span>
          Add Member
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Tasks */}
          <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2">
              <FiList className="h-5 w-5 text-blue-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Total Member
              </span>
            </div>
            <span className="text-3xl font-bold text-gray-800 dark:text-white">
              6
            </span>
            <span className="text-xs text-gray-400">All tasks</span>
          </div>

          {/* Completed */}
          <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                On track
              </span>
            </div>
            <span className="text-3xl font-bold text-gray-800 dark:text-white">
              0
            </span>
            <span className="text-xs text-gray-400">0% rate</span>
          </div>

          {/* Pending */}
          <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2">
              <FiClock className="h-5 w-5 text-yellow-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                At capacity
              </span>
            </div>
            <span className="text-3xl font-bold text-gray-800 dark:text-white">
              6
            </span>
            <span className="text-xs text-gray-400">To do tasks</span>
          </div>

          {/* Overdue */}
          <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl dark:bg-gray-800 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Pending Invites
              </span>
            </div>
            <span className="text-3xl font-bold text-gray-800 dark:text-white">
              0
            </span>
            <span className="text-xs font-semibold text-red-400">
              Need action
            </span>
          </div>
        </div>
      </section>
      <div className="">
        <TeamDirectory />
        <WhosWorking />
      </div>
    </>
  );
};

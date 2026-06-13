import React, { useEffect, useState } from "react";
import { db } from "../Config/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { Divider } from "primereact/divider";

import {
  FiCheckCircle,
  FiPlusCircle,
  FiArrowRightCircle,
  FiPlusSquare,
} from "react-icons/fi";

const getActivityInfo = (task) => {
  switch (task.status) {
    case "completed":
      return {
        icon: <FiCheckCircle className="mt-0.5 text-green-500" />,
        label: `${task.assignedTo} completed the task`,
      };
    case "in-review":
      return {
        icon: <FiArrowRightCircle className="mt-0.5 text-yellow-500" />,
        label: `${task.assignedTo} moved the task to review`,
      };
    case "in-progress":
      return {
        icon: <FiArrowRightCircle className="mt-0.5 text-blue-500" />,
        label: `${task.assignedTo} started the task`,
      };
    default:
      return {
        icon: <FiPlusCircle className="mt-0.5 text-blue-500" />,
        label: `${task.assignedTo} added a new task`,
      };
  }
};

export const RecentActivity = () => {
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "tasks"),
      orderBy("createdAt", "desc"),
      limit(5),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recentTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecentTasks(recentTasks);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white border-2 p-4 rounded-lg border-gray-300 dark:border-gray-600 max-h-96 md:max-h-[18rem] overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent activity
        </h2>
      </div>

      <ul className="space-y-4">
        {recentTasks.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No recent activity
          </p>
        ) : (
          recentTasks.map((task, index) => {
            const { icon, label } = getActivityInfo(task);
            return (
              <>
                <li
                  key={task.id}
                  className="space-y-1 text-sm text-gray-700 dark:text-gray-200"
                >
                  <div className="flex items-start gap-2">
                    {icon}
                    <span>
                      {label} — <strong>{task.title}</strong>
                    </span>
                  </div>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    {task.createdAt?.toDate().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </li>

                {index < recentTasks.length - 1 && (
                  <Divider className="border-gray-300 dark:border-gray-600" />
                )}
              </>
            );
          })
        )}
      </ul>
    </div>
  );
};

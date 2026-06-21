import React, { useEffect, useState } from "react";
import { db } from "../Config/firebase";
import { where } from "firebase/firestore";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  getDoc,
  doc,
} from "firebase/firestore";

import { Divider } from "primereact/divider";

import {
  FiCheckCircle,
  FiPlusCircle,
  FiArrowRightCircle,
} from "react-icons/fi";
import { useAuth } from "../Auth/AuthContex";

const getActivityInfo = (task) => {
  switch (task.status) {
    case "Completed":
      return {
        icon: <FiCheckCircle className="mt-0.5 text-green-500" />,
        label: `${task.assignedTo.username} completed the task`,
      };
    case "Review":
      return {
        icon: <FiArrowRightCircle className="mt-0.5 text-yellow-500" />,
        label: `${task.assignedTo.username} moved the task to review`,
      };
    case "In Progress":
      return {
        icon: <FiArrowRightCircle className="mt-0.5 text-blue-500" />,
        label: `${task.assignedTo.username} started the task`,
      };
    default:
      return {
        icon: <FiPlusCircle className="mt-0.5 text-blue-500" />,
        label: `${task.assignedTo.username} added a new task`,
      };
  }
};

export const RecentActivity = () => {
  const [recentTasks, setRecentTasks] = useState([]);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const tasksRef = collection(db, "tasks");

    const q = isAdmin
      ? query(tasksRef, orderBy("createdAt", "desc"), limit(5))
      : query(
          tasksRef,
          where("assignedTo", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(5),
        );

    // ✅ onSnapshot kept — async fetch inside
    // const q = isAdmin
    //   ? query(tasksRef)
    //   : query(tasksRef, where("assignedTo", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchTasks = async () => {
        const tasks = await Promise.all(
          snapshot.docs.map(async (document) => {
            const task = { id: document.id, ...document.data() };

            try {
              const userDoc = await getDoc(doc(db, "users", task.assignedTo));
              const username = userDoc.exists()
                ? userDoc.data().username
                : "Unknown";

              return {
                ...task,
                assignedTo: { uid: task.assignedTo, username },
              };
            } catch (error) {
              return {
                ...task,
                assignedTo: { uid: task.assignedTo, username: "Unknown" },
              };
            }
          }),
        );

        setRecentTasks(tasks);
      };

      fetchTasks();
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

import { Fragment, useEffect, useState } from "react";
import { db } from "../../Config/firebase";
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
import { useAuth } from "../../Hooks/useAuth";

export const RecentActivity = () => {
  const [recentTasks, setRecentTasks] = useState([]);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user?.uid && !isAdmin) return;

    const tasksRef = collection(db, "tasks");

    const q = isAdmin
      ? query(tasksRef, orderBy("createdAt", "desc"), limit(5))
      : query(
          tasksRef,
          where("assignedTo", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(5),
        );

    // Tracks the latest snapshot so an older async batch can't overwrite a newer one
    let requestId = 0;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const currentRequest = ++requestId;

        const fetchTasks = async () => {
          const tasks = await Promise.all(
            snapshot.docs.map(async (document) => {
              const task = { id: document.id, ...document.data() };

              // Resolve assignee display name
              let assignedUsername = "Unknown";
              try {
                const userDoc = await getDoc(doc(db, "users", task.assignedTo));
                assignedUsername = userDoc.exists()
                  ? userDoc.data().username
                  : "Unknown";
              } catch {
                assignedUsername = "Unknown";
              }

              // Resolve creator info if present (createdBy)
              let creator = null;
              if (task.createdBy) {
                try {
                  const creatorDoc = await getDoc(
                    doc(db, "users", task.createdBy),
                  );
                  if (creatorDoc.exists()) {
                    const cd = creatorDoc.data();
                    creator = {
                      uid: task.createdBy,
                      username: cd.username || null,
                      role: cd.userRole || null,
                    };
                  } else {
                    creator = {
                      uid: task.createdBy,
                      username: null,
                      role: null,
                    };
                  }
                } catch {
                  creator = { uid: task.createdBy, username: null, role: null };
                }
              }

              return {
                ...task,
                assignedTo: {
                  uid: task.assignedTo,
                  username: assignedUsername,
                },
                creator,
              };
            }),
          );

          // Only commit if a newer snapshot hasn't already started fetching
          if (currentRequest === requestId) {
            setRecentTasks(tasks);
          }
        };

        fetchTasks();
      },
      (error) => {
        // This is critical: a missing composite index (where + orderBy)
        // fails silently without this handler, and the listener just stops.
        console.error("RecentActivity listener error:", error);
      },
    );

    return () => unsubscribe();
  }, [user?.uid, isAdmin]);

  const getActivityInfo = (task) => {
    const assigned = task.assignedTo || {};
    const creator = task.creator || null;
    const actor = creator || {
      uid: assigned?.uid,
      username: assigned?.username,
    };
    const isActorCurrentUser = actor?.uid === user?.uid;
    const isActorAdmin = actor?.role === "admin";
    const actorName = actor?.username || actor?.uid || "Someone";
    const assigneeName = assigned?.username || assigned?.uid || "Someone";
    const status = String(task.status || "").toLowerCase();

    if (status.includes("complete") || status === "done") {
      if (isActorCurrentUser) {
        return {
          icon: <FiCheckCircle className="mt-0.5 text-green-500" />,
          label: `You completed the task`,
        };
      }
      if (isActorAdmin) {
        if (actor?.uid === assigned?.uid)
          return {
            icon: <FiCheckCircle className="mt-0.5 text-green-500" />,
            label: `Admin completed the task`,
          };
        return {
          icon: <FiCheckCircle className="mt-0.5 text-green-500" />,
          label: `Admin completed the task for ${assigneeName}`,
        };
      }
      if (actor?.uid === assigned?.uid)
        return {
          icon: <FiCheckCircle className="mt-0.5 text-green-500" />,
          label: `${actorName} completed the task`,
        };
      return {
        icon: <FiCheckCircle className="mt-0.5 text-green-500" />,
        label: `${actorName} completed the task for ${assigneeName}`,
      };
    }

    if (status.includes("review")) {
      if (isActorCurrentUser) {
        return {
          icon: <FiArrowRightCircle className="mt-0.5 text-yellow-500" />,
          label: `You moved the task to review`,
        };
      }
      if (isActorAdmin) {
        if (actor?.uid === assigned?.uid)
          return {
            icon: <FiArrowRightCircle className="mt-0.5 text-yellow-500" />,
            label: `Admin moved the task to review`,
          };
        return {
          icon: <FiArrowRightCircle className="mt-0.5 text-yellow-500" />,
          label: `Admin moved the task to review for ${assigneeName}`,
        };
      }
      if (actor?.uid === assigned?.uid)
        return {
          icon: <FiArrowRightCircle className="mt-0.5 text-yellow-500" />,
          label: `${actorName} moved the task to review`,
        };
      return {
        icon: <FiArrowRightCircle className="mt-0.5 text-yellow-500" />,
        label: `${actorName} moved the task to review for ${assigneeName}`,
      };
    }

    if (
      status.includes("progress") ||
      status.includes("in progress") ||
      status.includes("in-progress")
    ) {
      if (isActorCurrentUser) {
        return {
          icon: <FiArrowRightCircle className="mt-0.5 text-blue-500" />,
          label: `You started the task`,
        };
      }
      if (isActorAdmin) {
        if (actor?.uid === assigned?.uid)
          return {
            icon: <FiArrowRightCircle className="mt-0.5 text-blue-500" />,
            label: `Admin started the task`,
          };
        return {
          icon: <FiArrowRightCircle className="mt-0.5 text-blue-500" />,
          label: `Admin started the task for ${assigneeName}`,
        };
      }
      if (actor?.uid === assigned?.uid)
        return {
          icon: <FiArrowRightCircle className="mt-0.5 text-blue-500" />,
          label: `${actorName} started the task`,
        };
      return {
        icon: <FiArrowRightCircle className="mt-0.5 text-blue-500" />,
        label: `${actorName} started the task for ${assigneeName}`,
      };
    }
    // Special message when the current admin created the task
    // For 'added' actions include who added and who the task is for
    if (isActorCurrentUser) {
      if (actor?.uid === assigned?.uid) {
        return {
          icon: <FiPlusCircle className="mt-0.5 text-blue-500" />,
          label: `You added a new task`,
        };
      }
      return {
        icon: <FiPlusCircle className="mt-0.5 text-blue-500" />,
        label: `You added a new task for ${assigneeName}`,
      };
    }

    if (isActorAdmin) {
      if (actor?.uid === assigned?.uid) {
        return {
          icon: <FiPlusCircle className="mt-0.5 text-blue-500" />,
          label: `Admin added a new task`,
        };
      }
      return {
        icon: <FiPlusCircle className="mt-0.5 text-blue-500" />,
        label: `Admin added a new task for ${assigneeName}`,
      };
    }

    // Default: another user
    if (actor?.uid === assigned?.uid) {
      return {
        icon: <FiPlusCircle className="mt-0.5 text-blue-500" />,
        label: `${actorName} added a new task`,
      };
    }
    return {
      icon: <FiPlusCircle className="mt-0.5 text-blue-500" />,
      label: `${actorName} added a new task for ${assigneeName}`,
    };
  };

  return (
    <div className="bg-white border-2 p-4 rounded-lg border-gray-300 dark:border-gray-600 overflow-y-auto">
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
              <Fragment key={task.id}>
                <li className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
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
              </Fragment>
            );
          })
        )}
      </ul>
    </div>
  );
};

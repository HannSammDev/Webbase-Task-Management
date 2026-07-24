import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../Config/firebase";
import { useAuth } from "../../Hooks/useAuth";
import { timeAgo } from "../../Composable/timeago";

export const WhosWorking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [liveMode, setLiveMode] = useState(false);
  const [activity, setActivity] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(true);

  const { isAdmin, user } = useAuth();


  // fetch users once to build a uid -> { username, role } lookup map
  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
      const map = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        map[doc.id] = {
          username: data.username || data.name || doc.id,
          role: data.userRole || "user",
        };
      });
      setUsersMap(map);
    });

    return () => unsubscribeUsers();
  }, []);

  // fetch tasks and build activity feed
  useEffect(() => {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const now = new Date();

        const mapped = snapshot.docs.map((doc) => {
          const data = doc.data();
          const status = String(data.status || "").toLowerCase();

          const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate()
            : null;
          const dueDate = data.dueDate?.toDate ? data.dueDate.toDate() : null;

          const isTodo = status.includes("todo") || status === "todo";
          const isCompleted = status.includes("complete") || status === "done";
          const isPastDue = dueDate ? dueDate.getTime() < now.getTime() : false;
          const assignedUser = usersMap[data.assignedTo];
          const isAssigneeAdmin = assignedUser?.role === "admin";
          const assigneeName =
            assignedUser?.username || data.assignedTo || "Someone";
          let type = "started";
          let action = "started the task";
          let refDate = createdAt;

          if (isCompleted) {
            type = "completed";
            action = "completed the task";
          } else if (isPastDue) {
            type = "overdue";
            action = "has an overdue task";
            refDate = dueDate;
          } else if (status.includes("progress")) {
            type = "started";
            action = "started the task";
          } else if (isTodo) {
            type = "todo";
            action = isAdmin
              ? isAssigneeAdmin
                ? "added a new task"
                : `added a new task for ${assigneeName}`
              : "";
          }

          return {
            id: doc.id,
            ...data,
            user:
              isAdmin && data.createdBy === user?.uid
                ? "You"
                : data.createdByName || data.createdBy || "Someone",
            assignee: assigneeName,
            task: data.title || "Untitled task",
            dueDate,
            createdAt,
            type,
            action,
            time: timeAgo(refDate),
          };
        });

        setActivity(mapped);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching activities:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [usersMap, isAdmin, user]);

  const filtered =
    activeTab === "overdue"
      ? activity.filter((a) => a.type === "overdue")
      : activity;

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
        {loading ? (
          <li className="text-sm text-gray-400 text-center py-4">Loading...</li>
        ) : filtered.length === 0 ? (
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

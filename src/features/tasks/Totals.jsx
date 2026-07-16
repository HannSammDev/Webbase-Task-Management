import { useEffect, useState } from "react";
import {
  FiList,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
} from "react-icons/fi";
import { db } from "../../Config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { RecentActivity } from "./RecentActivity";
import { Calendar } from "./Calendar";
// import { useAuth } from "../Auth/AuthContex";

// ✅ Status constants matching your Firestore exactly
const TASK_STATUS = {
  TODO: "To do",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
};

export const Totals = () => {
  // const { isAdmin } = useAuth();
  const [totals, setTotals] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "tasks"),
      (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTotals({
          total: tasks.length,
          completed: tasks.filter((t) => t.status === TASK_STATUS.COMPLETED)
            .length,
          pending: tasks.filter((t) => t.status === TASK_STATUS.TODO).length,
          overdue: tasks.filter((t) => t.status === TASK_STATUS.OVERDUE).length,
        });
      },
      (error) => {
        console.error("Firestore error:", error);
      },
    );

    return () => unsub(); // ✅ cleanup listener
  }, []);

  const completionRate =
    totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0;

   
  
  return (
    <>
      {/* ✅ Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Total Tasks */}
        <div className="col-span-1 flex flex-col justify-start items-start gap-3 bg-white border-2 border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 h-auto md:h-40 p-5">
          <div className="flex items-center gap-2 text-blue-500">
            <FiList className="h-6 w-6" />
            <span className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Total Tasks
            </span>
          </div>
          <span className="text-3xl font-bold dark:text-white">
            {totals.total}
          </span>
          <span className="text-xs font-semibold text-gray-500">All tasks</span>
        </div>

        {/* Completed Tasks */}
        <div className="col-span-1 flex flex-col justify-start items-start gap-3 bg-white border-2 border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 h-auto md:h-40 p-5">
          <div className="flex items-center gap-2 text-emerald-500">
            <FiCheckCircle className="h-6 w-6" />
            <span className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Completed
            </span>
          </div>
          <span className="text-3xl font-bold dark:text-white">
            {totals.completed}
          </span>
          <span className="text-xs font-semibold text-gray-500">
            {completionRate}% rate
          </span>
        </div>

        {/* Pending Tasks */}
        <div className="col-span-1 flex flex-col justify-start items-start gap-3 bg-white border-2 border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 h-auto md:h-40 p-5">
          <div className="flex items-center gap-2 text-yellow-500">
            <FiClock className="h-6 w-6" />
            <span className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Pending
            </span>
          </div>
          <span className="text-3xl font-bold dark:text-white">
            {totals.pending}
          </span>
          <span className="text-xs font-semibold text-gray-500">
            To do tasks
          </span>
        </div>

        {/* Overdue Tasks */}
        <div className="col-span-1 flex flex-col justify-start items-start gap-3 bg-white border-2 border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 h-auto md:h-40 p-5">
          <div className="flex items-center gap-2 text-red-500">
            <FiAlertTriangle className="h-6 w-6" />
            <span className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Overdue
            </span>
          </div>
          <span className="text-3xl font-bold dark:text-white">
            {totals.overdue}
          </span>
          <span className="text-xs font-semibold text-red-500">
            Need action
          </span>
        </div>
      </div>

      {/* ✅ Recent Activity & Calendar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <RecentActivity />
        <Calendar />
      </div>
    </>
  );
};

import { useState, useEffect } from "react";
import { FiMoreHorizontal, FiChevronDown } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { db } from "../../Config/firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/useAuth";

export const TeamDirectory = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [members, setMembers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const membersRef = collection(db, "users");
    const tasksRef = collection(db, "tasks");

    let membersData = [];
    let tasksData = [];

    const mergeAndSetMembers = () => {
      const merged = membersData.map((member) => {
        const taskCount = tasksData.filter(
          (task) => task.assignedTo === member.id,
        ).length;
        return { ...member, activeTasks: taskCount };
      });

      setMembers(merged);
    };

    const unsubscribeMembers = onSnapshot(
      membersRef,
      (snapshot) => {
        membersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        membersData.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
        // setMembers(membersData);
        mergeAndSetMembers();
      },
      (error) => {
        console.error("Error fetching members:", error);
      },
    );

    const unsubscribeTasks = onSnapshot(
      tasksRef,
      (snapshot) => {
        tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        mergeAndSetMembers();
      },
      (error) => {
        console.error("Error fetching tasks:", error);
      },
    );

    return () => {
      unsubscribeMembers();
      unsubscribeTasks();
    };
  }, []);

  const handleRemoveMember = (memberId, memberName) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="text-sm text-gray-800">
            Remove{" "}
            <span className="font-semibold">{memberName || "this member"}</span>{" "}
            from the team? This will permanently delete their account.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1.5 rounded-full bg-blue-100 text-blue-900 text-sm font-medium hover:bg-blue-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmRemoveMember(memberId);
              }}
              className="px-4 py-1.5 rounded-full bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800"
            >
              OK
            </button>
          </div>
        </div>
      ),
      { duration: 6000 },
    );
  };

  const confirmRemoveMember = async (memberId) => {
    setDeletingId(memberId);
    try {
      // Delete Firestore doc first — safer failure mode
      await deleteDoc(doc(db, "users", memberId));

      const response = await fetch(
        `http://localhost:5000/delete-user/${memberId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.message || `Failed to delete auth user (${response.status})`,
        );
      }

      toast.success("Member removed successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to remove member.");
    } finally {
      setDeletingId(null);
      setOpenMenu(null);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="bg-white border border-gray-200 mb-3 rounded-xl p-4 dark:bg-gray-800 dark:border-gray-700">
        {/* Header */}
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
          Team Directory
        </h2>

        {/* Member List */}
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {members.map((member) => (
            <li
              key={member.id}
              className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-4 py-3"
            >
              {/* Avatar + Info */}
              <div className="flex items-center gap-3 min-w-0">
                <FaUserCircle className="w-10 h-10 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {member.username || "Unnamed"}
                  </p>
                  <span className="inline-block mt-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    {member.userRole || "No role"}
                  </span>
                </div>
              </div>

              {/* Active Tasks */}
              <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {member.activeTasks ?? 0} Active Tasks
              </span>

              {/* Status Badge */}
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full whitespace-nowrap w-fit dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                {member.status || "Active"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 relative justify-end">
                <button
                  onClick={() =>
                    setOpenMenu(openMenu === member.id ? null : member.id)
                  }
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                >
                  <FiMoreHorizontal className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <FiChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {openMenu === member.id && (
                  <div className="absolute right-0 top-8 z-10 w-40 bg-white border border-gray-200 rounded-xl shadow-md dark:bg-gray-700 dark:border-gray-600">
                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-300">
                      {["View profile", "Assign task", "Remove member"].map(
                        (action) => (
                          <li key={action}>
                            <button
                              disabled={deletingId === member.id}
                              onClick={() => {
                                if (action === "Remove member") {
                                  handleRemoveMember(
                                    member.id,
                                    member.username,
                                  );
                                } else if (action === "View profile") {
                                  // Navigate to profile page or show profile modal
                                  navigate(`/aac/${user.uid}`);
                                } else if (action === "Assign task") {
                                  // Navigate to assign task page or show assign task modal
                                }
                              }}
                              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 ${
                                action === "Remove member" ? "text-red-500" : ""
                              }`}
                            >
                              {action === "Remove member" &&
                              deletingId === member.id
                                ? "Removing..."
                                : action}
                            </button>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

import React, { useEffect, useState } from "react";
import { FiList, FiCheckCircle, FiClock, FiUser } from "react-icons/fi";
import { Card } from "primereact/card";

import { TeamDirectory } from "./teamDerictory";
import { WhosWorking } from "./twhoseworking";
import { Modal } from "../../components/shared/Modal";
import { RegisterForm } from "../../features/auth/RegisterForm";
import { useAuth } from "../../Hooks/useAuth";
import { db } from "../../Config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const Teams = () => {
  const [members, setMembers] = useState([]);

  const [stats, setStats] = useState({
    totalMembers: 0,
    onTrack: 0,
    atCapacity: 0,
    available: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAdmin } = useAuth();

  useEffect(() => {
    let users = [];
    let tasks = [];

    const calculateStats = () => {
      // Count tasks per member
      const taskCount = {};

      tasks.forEach((task) => {
        if (!task.assignedTo) return;

        taskCount[task.assignedTo] = (taskCount[task.assignedTo] || 0) + 1;
      });

      let onTrack = 0;
      let atCapacity = 0;
      let available = 0;

      users.forEach((user) => {
        const count = taskCount[user.id] || 0;

        if (count === 0) {
          available++;
        } else if (count <= 3) {
          onTrack++;
        } else {
          atCapacity++;
        }
      });

      setMembers(users);

      setStats({
        totalMembers: users.length,
        onTrack,
        atCapacity,
        available,
      });
    };

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      calculateStats();
    });

    const unsubscribeTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      calculateStats();
    });

    return () => {
      unsubscribeUsers();
      unsubscribeTasks();
    };
  }, []);

  const statCards = [
    {
      key: "totalMembers",
      label: "Total Members",
      value: stats.totalMembers,
      caption: "Registered members",
      icon: <FiList className="h-5 w-5 text-blue-500" />,
    },
    {
      key: "onTrack",
      label: "On Track",
      value: stats.onTrack,
      caption: "Members with 1–3 tasks",
      icon: <FiCheckCircle className="h-5 w-5 text-emerald-500" />,
    },
    {
      key: "atCapacity",
      label: "At Capacity",
      value: stats.atCapacity,
      caption: "Members with 4+ tasks",
      icon: <FiClock className="h-5 w-5 text-yellow-500" />,
    },
    {
      key: "available",
      label: "Available",
      value: stats.available,
      caption: "Members without tasks",
      icon: <FiUser className="h-5 w-5 text-cyan-500" />,
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Team Members
          </h1>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <span>+</span>
            Add Member
          </button>
        )}

        <Modal
          size="2xl"
          transition="fade"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <RegisterForm />
        </Modal>
      </div>

      {/* Dashboard Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
            <Card
              key={stat.key}
              className="dark:bg-gray-800 dark:border-gray-700"
              pt={{
                body: { className: "p-0" },
                content: { className: "p-5" },
              }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {stat.label}
                  </span>
                </div>

                <span className="text-3xl font-bold text-gray-800 dark:text-white">
                  {stat.value}
                </span>

                <span className="text-xs text-gray-400">{stat.caption}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Components */}
      <div>
        <TeamDirectory />
        <WhosWorking />
      </div>
    </>
  );
};

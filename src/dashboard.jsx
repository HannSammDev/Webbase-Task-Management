import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "./Auth/AuthContex";
import { auth } from "./Config/firebase";
import { signOut } from "firebase/auth";
import {
  FiMenu,
  FiSearch,
  FiHome,
  FiClipboard,
  FiGrid,
  FiCalendar,
  FiBriefcase,
  FiArchive,
  FiUsers,
  FiBell,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { AddTaskForm } from "./components/AddTaskForm";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const primaryLinks = [
  { to: "/overview", icon: FiHome, label: "Overview" },
  { to: "/mytask", icon: FiClipboard, label: "Task" },
  { to: "/kanban", icon: FiGrid, label: "Kanban" },
  { to: "/calendar", icon: FiCalendar, label: "Calendar" },
  // { to: "/workspace", icon: FiBriefcase, label: "Workspace" },
];

const secondaryLinks = [
  // { to: "/project", icon: FiArchive, label: "Project" },
  { to: "/team", icon: FiUsers, label: "Team" },
  { to: "/notifications", icon: FiBell, label: "Notifications", badge: 3 },
];

export const Dash_Board = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, userData, isAdmin } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await signOut(auth);
    navigate("/");
  }

  const location = useLocation();
  const hideTopbar = location.pathname === "/team";
  const showLogo = location.pathname == "/team";

  const navClass = ({ isActive }) =>
    `flex items-center p-2 text-base font-medium rounded-lg group transition-colors duration-150 ${
      isActive
        ? "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-white"
        : "text-white text-sm hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 hover:text-black"
    }`;

  const iconClass = (isActive) =>
    isActive
      ? "w-6 h-6 text-blue-600 dark:text-blue-400"
      : "w-6 h-6 text-white group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white";

  const renderLinks = (links) =>
    links.map(({ to, icon: Icon, label, badge }) => (
      <li key={to}>
        <NavLink to={to} onClick={() => setSidebarOpen(false)}>
          {({ isActive }) => (
            <div className={navClass({ isActive })}>
              <Icon className={iconClass(isActive)} />
              <span className="ml-3">{label}</span>
              {badge && (
                <span className="bg-red-100 text-red-800 text-xs font-bold ml-3 px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                  {badge}
                </span>
              )}
            </div>
          )}
        </NavLink>
      </li>
    ));

  return (
    <>
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        {/* ── Top Navbar ── */}
        {!hideTopbar && (
          <nav className="flex flex-wrap items-center justify-between bg-blue-700 border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="p-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <FiMenu
                  className="w-6 h-6 text-white hover:text-black"
                  aria-hidden="true"
                />
                <span className="sr-only">Toggle sidebar</span>
              </button>
              <div className="flex items-center gap-3">
                <img
                  src="./logo2.png"
                  className="h-10 rounded-full border-2 border-white"
                  alt="Logo"
                />
                <span className="self-center text-white text-xl font-semibold whitespace-nowrap dark:text-white">
                  Dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <form className="hidden md:flex md:items-center md:pl-2">
                <div className="relative w-full">
                  <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <FiSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-80 pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Search Task"
                  />
                </div>
              </form>
              {isAdmin && <AddTaskForm />}

              {/* ── Profile Dropdown ── */}
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                  <span className="sr-only">Open user menu</span>
                  <FaUserCircle className="w-8 h-8 text-gray-300 border-2 border-amber-50 rounded-full" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 z-50 text-base list-none bg-white rounded-xl divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                    <div className="py-3 px-4">
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                        {userData?.username || "User"}
                      </span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                        {userData?.email || user?.email}
                      </span>
                    </div>
                    <ul className="py-1 text-gray-700 dark:text-gray-300">
                      {[
                        { label: "My profile", path: "/profile" },
                        { label: "Account settings", path: "/settings" },
                      ].map(({ label, path }) => (
                        <li key={path}>
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              navigate(path);
                            }}
                            className="w-full text-left block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                          >
                            {label}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <ul className="py-1 text-gray-700 dark:text-gray-300">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-500"
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}

        {/* Sidebar mobile overlay */}
        <div
          className={`${sidebarOpen ? "block" : "hidden"} fixed inset-0 z-30 bg-black/40 md:hidden`}
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── Sidebar ── */}
        {/* ── Sidebar ── */}
        <aside
          className={`bg-blue-700 fixed top-0 left-0 z-40 w-64 h-screen transition-transform border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 
          ${hideTopbar ? "pt-0" : "pt-15"} 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          {showLogo && (
            <div className="flex items-center gap-3 px-3 py-4 border-b border-blue-600">
              <img
                src="./logo2.png"
                className="h-10 rounded-full border-2 border-white"
                alt="Logo"
              />
              <span className="self-center text-white text-xl font-semibold whitespace-nowrap dark:text-white">
                Dashboard
              </span>
            </div>
          )}

          <div className="overflow-y-auto py-5 px-3 h-full dark:bg-gray-800">
            <ul className="space-y-2">{renderLinks(primaryLinks)}</ul>
            <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
              {renderLinks(secondaryLinks)}
            </ul>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main
          className={`p-4 md:ml-64 h-auto ${hideTopbar ? "pt-4" : "pt-20"}`}
        >
          <Outlet />
        </main>

        {/* ── Main Content ── */}
      </div>
    </>
  );
};

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
import { AddTaskForm } from "./component/AddTaskForm";
import { NavLink, Outlet, useNavigate } from "react-router-dom"; // ✅ NavLink imported

export const Dash_Board = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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

  // ✅ Reusable NavLink class helper
  const navClass = ({ isActive }) =>
    `flex items-center p-2 text-base font-medium rounded-lg group transition-colors duration-150 ${
      isActive
        ? "bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-white"
        : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
    }`;

  const iconClass =
    "w-6 h-6 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white";

  return (
    <>
      <div className="antialiased bg-gray-50 dark:bg-gray-900">
        {/* ── Top Navbar ── */}
        <nav className="flex flex-wrap items-center justify-between bg-white border-b border-gray-200 px-4 py-2.5 dark:bg-gray-800 dark:border-gray-700 fixed left-0 right-0 top-0 z-50">
          <div className="flex items-center gap-2">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <FiMenu className="w-6 h-6" aria-hidden="true" />
              <span className="sr-only">Toggle sidebar</span>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="./logo2.png" className="h-10 rounded-full" alt="Logo" />
              <span className="self-center text-blue-800 text-xl font-semibold whitespace-nowrap dark:text-white">
                Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Search bar */}
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

            <AddTaskForm />

            {/* ── Profile Dropdown ── */}
            <div className="relative ml-3" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png"
                  alt="user photo"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 z-50 text-base list-none bg-white rounded-xl divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                  {/* User info */}
                  <div className="py-3 px-4">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                      {userData?.username || "User"}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {userData?.email || user?.email}
                    </span>
                  </div>

                  {/* Menu links */}
                  <ul className="py-1 text-gray-700 dark:text-gray-300">
                    <li>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        My profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/settings");
                        }}
                        className="w-full text-left block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                      >
                        Account settings
                      </button>
                    </li>
                  </ul>

                  {/* Sign out */}
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
            {/* ── End Profile Dropdown ── */}
          </div>
        </nav>

        {/* Sidebar mobile overlay */}
        <div
          className={`${sidebarOpen ? "block" : "hidden"} fixed inset-0 z-30 bg-black/40 md:hidden`}
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── Sidebar ── */}
        <aside
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
          id="drawer-navigation"
        >
          <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
            {/* Primary nav */}
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/overview"
                  className={navClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiHome className={iconClass} />
                  <span className="ml-3">Overview</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/mytask"
                  className={navClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiClipboard className={iconClass} />
                  <span className="ml-3">My Tasks</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/kanban"
                  className={navClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiGrid className={iconClass} />
                  <span className="ml-3">Kanban</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/calendar"
                  className={navClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiCalendar className={iconClass} />
                  <span className="ml-3">Calendar</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/workspace"
                  className={navClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiBriefcase className={iconClass} />
                  <span className="ml-3">Workspace</span>
                </NavLink>
              </li>
            </ul>

            {/* Secondary nav */}
            <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
              <li>
                <NavLink
                  to="/project"
                  className={navClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiArchive className={iconClass} />
                  <span className="ml-3">Project</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/team"
                  className={navClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiUsers className={iconClass} />
                  <span className="ml-3">Team</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/notifications"
                  className={navClass}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FiBell className={iconClass} />
                  <span className="ml-3">Notifications</span>
                  <span className="bg-red-100 text-red-800 text-xs font-bold ml-3 px-2 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                    3
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="p-4 md:ml-64 h-auto pt-20">
          <Outlet />
        </main>
      </div>
    </>
  );
};

import React from "react";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";

export const LoginForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="mx-auto max-w-md w-full px-4 py-8">
      <div className="overflow-hidden rounded-3xl bg-white  dark:ring-white/10">
        <div className="p-8 sm:p-3">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign in to your workspace and continue where you left off.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <FiMail
                  className="h-5 w-5 text-gray-400 dark:text-gray-300"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <FiLock
                  className="h-5 w-5 text-gray-400 dark:text-gray-300"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              onClick={() => navigate("/dashboard") }
              type="submit"
              label="Sign In"
              severity="info"
              size="small"
              style={{ width: "100%" }}
            />

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

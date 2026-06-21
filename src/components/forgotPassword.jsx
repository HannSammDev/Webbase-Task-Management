import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
export const ForgotPassword = () => {
    const [email, setEmail] = useState();
  return (
    <section className="text-center">
      <div className="text-center">
        <h1>Search account</h1>
      </div>
      <form action="" className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Email
          </label>
          <div className="mt-2 w-50 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <FiMail
              className="h-5 w-5 text-gray-400 dark:text-gray-300"
              aria-hidden="true"
            />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setValue()}
              placeholder="example@gmail.com"
              className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
              required
            />
          </div>
        </div>
      </form>
    </section>
  );
};

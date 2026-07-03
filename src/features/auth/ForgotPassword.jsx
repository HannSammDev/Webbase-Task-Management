import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { auth } from "../../Config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset link sent. Please check your email.");
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Unable to send reset link. Please verify your email.");
    }
  };
  return (
    <section className="text-center">
      <div className="text-center">
        <h1>Search account</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
              required
            />
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-500">{message}</p>}
        <div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Send reset link
          </button>
        </div>
      </form>
    </section>
  );
};

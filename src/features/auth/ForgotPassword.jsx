import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiCheckCircle,
  FiMail,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { auth } from "../../Config/firebase";
import { getResetErrorMessage } from "../../Error/AuthErrorMessage";
import { Button } from "primereact/button";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      // Let Firebase Auth handle the lookup directly — no Firestore read needed.
      // This also avoids leaking which emails are registered in your system.
      await sendPasswordResetEmail(auth, trimmedEmail);
      setMessage(
        "Reset link has been sent.",
      );
    } catch (err) {
      console.error("Reset password error:", err);
      setError(getResetErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-50 dark:text-white ">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-white shadow-2xl dark:shadow-2xl shadow-slate-900/5 dark:shadow-slate-900/5 ring-1 ring-slate-200  dark:ring-white/10">
          <div className="p-8 sm:p-10">
            <div className="mb-8 space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>

              <div>
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-900">
                  Forgot your password?
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                  Enter the email linked to your account and we'll send a reset
                  link.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-700"
                >
                  Email
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-200 bg-gray-50 dark:bg-gray-50 px-3 py-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500   dark:text-white">
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
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-50 dark:text-red-700"
                >
                  <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500  dark:text-red-500" />
                  <p>{error}</p>
                </div>
              )}

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                >
                  <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-300" />
                  <p>{message}</p>
                </div>
              )}

              <Button
                size="small"
                severity="info"
                label={loading ? "Sending..." : "Send reset link"}
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

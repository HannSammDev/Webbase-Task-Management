import { useState } from "react";
import { FiAlertCircle, FiArrowLeft, FiCheckCircle, FiMail } from "react-icons/fi";
import { auth } from "../../Config/firebase";
import {
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getResetErrorMessage = (err) => {
    switch (err?.code) {
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/missing-email":
        return "Please enter your email address.";
      case "auth/operation-not-allowed":
        return "Email/password sign-in is disabled in Firebase. Enable it in the Firebase Console.";
      case "auth/too-many-requests":
        return "Too many reset attempts. Please wait a bit and try again.";
      case "auth/user-not-found":
        return "Email does not exist.";
      default:
        return err?.message || "Unable to send reset link. Please try again.";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const normalizedEmail = email.trim();

    try {
      if (!normalizedEmail) {
        setError("Please enter your email address.");
        return;
      }

      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        normalizedEmail,
      );

      // This check is reliable only when Email Enumeration Protection is disabled.
      if (signInMethods.length === 0) {
        setError("Email does not exist.");
        return;
      }

      await sendPasswordResetEmail(auth, normalizedEmail);
      setMessage("Password reset link has been sent.");
    } catch (err) {
      console.error("Reset password error:", err);
      setError(getResetErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
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
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                  Forgot your password?
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Enter the email linked to your account and we'll send a reset
                  link.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
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
                  className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
                >
                  <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500 dark:text-red-300" />
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

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

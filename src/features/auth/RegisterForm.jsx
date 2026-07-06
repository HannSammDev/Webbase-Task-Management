import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../Config/firebase";

export const RegisterForm = () => {
  const [value, setValue] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getRegisterErrorMessage = (err) => {
    switch (err?.code) {
      case "auth/email-already-in-use":
        return "An account already exists for that email.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password should be at least 6 characters long.";
      case "auth/operation-not-allowed":
        return "Email/password sign-in is disabled in Firebase. Enable it in the Firebase Console.";
      default:
        return (
          err?.message || "Unable to create your account. Please try again."
        );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const username = value.username.trim();
    const email = value.email.trim();
    const password = value.password;

    try {
      if (!username || !email || !password) {
        setError("Please fill out all fields.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
      });

      navigate("/");
    } catch (err) {
      console.error("Error creating user:", err);
      setError(getRegisterErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/5 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-white/10">
          <div className="p-8 sm:p-10">
            <div className="mb-5 space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>

              <div>
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                  Create your account
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Sign up to get started with your workspace.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Username
                </label>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  <FiUser
                    className="h-5 w-5 text-gray-400 dark:text-gray-300"
                    aria-hidden="true"
                  />
                  <InputText
                    id="username"
                    name="username"
                    type="text"
                    value={value.username}
                    onChange={(e) =>
                      setValue({ ...value, username: e.target.value })
                    }
                    placeholder="Your name"
                    className="flex-1 !border-0 !bg-transparent !p-0 text-base text-gray-900 placeholder:text-gray-400 !shadow-none focus:!outline-none focus:!ring-0 dark:text-white"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

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
                  <InputText
                    id="email"
                    name="email"
                    type="email"
                    value={value.email}
                    onChange={(e) =>
                      setValue({ ...value, email: e.target.value })
                    }
                    placeholder="example@gmail.com"
                    className="flex-1 !border-0 !bg-transparent !p-0 text-base text-gray-900 placeholder:text-gray-400 !shadow-none focus:!outline-none focus:!ring-0 dark:text-white"
                    autoComplete="email"
                    inputMode="email"
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
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                  <FiLock
                    className="h-5 w-5 text-gray-400 dark:text-gray-300"
                    aria-hidden="true"
                  />
                  <InputText
                    id="password"
                    name="password"
                    type="password"
                    value={value.password}
                    onChange={(e) =>
                      setValue({ ...value, password: e.target.value })
                    }
                    placeholder="Create a password"
                    className="flex-1 !border-0 !bg-transparent !p-0 text-base text-gray-900 placeholder:text-gray-400 !shadow-none focus:!outline-none focus:!ring-0 dark:text-white"
                    autoComplete="new-password"
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

              <Button
                type="submit"
                label={loading ? "Creating..." : "Create account"}
                disabled={loading}
                className="inline-flex !w-full items-center justify-center !rounded-2xl !border-0 !bg-blue-600 !px-4 !py-3 !text-white shadow-sm transition hover:!bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              />

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

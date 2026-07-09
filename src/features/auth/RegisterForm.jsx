import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  updateProfile,
} from "firebase/auth";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
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
import { getErrorMessage } from "../../Error/AuthErrorMessage";

export const RegisterForm = () => {
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    userRole: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const username = value.username.trim();
    const email = value.email.trim();
    const normalizedEmail = email.toLowerCase();
    const password = value.password;
    const userRole = value.userRole;

    try {
      if (!username || !email || !password || !userRole) {
        setError("Please fill out all fields.");
        return;
      }

      const [usersSnapshot, signInMethods] = await Promise.all([
        getDocs(collection(db, "users")),
        fetchSignInMethodsForEmail(auth, email),
      ]);

      const existingUser = usersSnapshot.docs.find((userDoc) => {
        const userEmail = String(userDoc.data()?.email || "")
          .trim()
          .toLowerCase();

        return userEmail === normalizedEmail;
      });

      if (existingUser || signInMethods.length > 0) {
        setError("An account already exists for that email.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      try {
        await updateProfile(userCredential.user, {
          displayName: username,
        });

        await setDoc(doc(db, "users", userCredential.user.uid), {
          username,
          email,
          userRole,
        });
      } catch (postCreateError) {
        await deleteUser(userCredential.user).catch((cleanupError) => {
          console.error("Error cleaning up partial auth user:", cleanupError);
        });

        throw postCreateError;
      }

      navigate("/");
    } catch (err) {
      console.error("Error creating user:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-white dark:text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col overflow-hidden md:flex-row">
        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-900/5 ring-1 ring-slate-200 sm:p-8 lg:p-10">
            <div className="mb-8 space-y-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
              >
                <FiArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>

              <h2 className="text-3xl font-extrabold text-gray-900">
                Create your account
              </h2>
              <p className="text-sm text-gray-500 sm:text-base">
                Sign up to get started with your workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 shadow-sm transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <FiUser
                    className="h-5 w-5 shrink-0 text-gray-400"
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
                    className="flex-1 !border-0 !bg-transparent !p-0 text-base text-gray-900 placeholder:text-gray-400 !shadow-none focus:!outline-none focus:!ring-0"
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 shadow-sm transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <FiMail
                    className="h-5 w-5 shrink-0 text-gray-400"
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
                    className="flex-1 !border-0 !bg-transparent !p-0 text-base text-gray-900 placeholder:text-gray-400 !shadow-none focus:!outline-none focus:!ring-0"
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 shadow-sm transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <FiLock
                    className="h-5 w-5 shrink-0 text-gray-400"
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
                    className="flex-1 !border-0 !bg-transparent !p-0 text-base text-gray-900 placeholder:text-gray-400 !shadow-none focus:!outline-none focus:!ring-0"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="userRole"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3 shadow-sm transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <select
                    name="userRole"
                    id="userRole"
                    value={value.userRole}
                    onChange={(e) =>
                      setValue({ ...value, userRole: e.target.value })
                    }
                    className="w-full border-0 bg-transparent p-0 text-base text-gray-900 shadow-none focus:outline-none focus:ring-0"
                    required
                  >
                    <option value="" disabled>Select a role</option>
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <p>{error}</p>
                </div>
              )}

              <div className="md:col-span-2">
                <Button
                  type="submit"
                  label={loading ? "Creating..." : "Create account"}
                  disabled={loading}
                  className="inline-flex !w-full items-center justify-center !rounded-2xl !border-0 !bg-blue-600 !px-4 !py-3 !text-white shadow-sm transition hover:!bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                />
              </div>

              <div className="md:col-span-2">
                <p className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/"
                    className="font-medium text-blue-600 transition hover:text-blue-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

import { useState } from "react";
import { auth } from "../../Config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { getErrorLogin } from "../../Error/AuthErrorMessage";
// import { Toast } from "primereact/toast";

export const LoginForm = () => {
  const [value, setValue] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const toast = useRef(null)
 

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    // navigate("/overview");
    try {
      await signInWithEmailAndPassword(auth, value.email, value.password);
      navigate("/overview");
      console.log("User signed in successfully");
    } catch (error) {
      console.error("Error signing in:", error);

      setError(
        getErrorLogin(error) ||
          "Failed to sign in. Please check your credentials and try again.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-md w-full px-4 py-8">
      <div className="overflow-hidden rounded-3xl  dark:bg-white dark:ring-white/10">
        <div className="p-8 sm:p-3">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900  dark:text-gray-900">
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
                className="block text-sm font-medium text-gray-700 dark:text-gray-700"
              >
                Email
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-200 bg-gray-50 dark:bg-gray-50 px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500   dark:text-white">
                <FiMail
                  className="h-5 w-5 text-gray-400 dark:text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={value.email}
                  onChange={(e) =>
                    setValue({ ...value, email: e.target.value })
                  }
                  placeholder="example@gmail.com"
                  className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-700"
              >
                Password
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-200 bg-gray-50 dark:bg-gray-50 px-3 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500  dark:text-white">
                <FiLock
                  className="h-5 w-5 text-gray-400 dark:text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={value.password}
                  onChange={(e) =>
                    setValue({ ...value, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button
              onClick={handleSubmit}
              type="submit"
              label="Sign In"
              severity="info"
              size="small"
              style={{ width: "100%" }}
            />

            
          </form>
        </div>
      </div>
    </div>
  );
};

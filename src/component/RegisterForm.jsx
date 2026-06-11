import React, { useState } from "react";
import { auth } from "../Config/firebase";
import { db } from "../Config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";

export const RegisterForm = () => {
  const [value, setValue] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        value.email,
        value.password,
      );
      await updateProfile(userCredential.user, {
        displayName: value.username,
      });
      // Save user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: value.username,
        email: value.email,
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error.message);
    }
  }

  return (
    <div className="mx-auto max-w-md w-full mt-10 px-4 py-8 border-2 border-gray-300 rounded-lg">
      <div className="overflow-hidden rounded-3xl bg-white dark:ring-white/10">
        <div className="p-8 sm:p-3">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Create an Account
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Sign up to get started with your workspace.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <FloatLabel>
                <InputText
                  size={20}
                  className="w-full"
                  id="username"
                  value={value.username}
                  onChange={(e) =>
                    setValue({ ...value, username: e.target.value })
                  }
                />
                <label htmlFor="username">Username</label>
              </FloatLabel>
            </div>

            <div>
              <FloatLabel>
                <InputText
                  className="w-full"
                  id="email"
                  placeholder="you@example.com"
                  value={value.email}
                  onChange={(e) =>
                    setValue({ ...value, email: e.target.value })
                  }
                />
                <label htmlFor="email">Email</label>
              </FloatLabel>
            </div>

            <div>
              <FloatLabel>
                <InputText
                  type="password"
                  className="w-full"
                  id="password"
                  value={value.password}
                  onChange={(e) =>
                    setValue({ ...value, password: e.target.value })
                  }
                />
                <label htmlFor="password">Password</label>
              </FloatLabel>
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <Button
                severity="info"
                size="small"
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Sign up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

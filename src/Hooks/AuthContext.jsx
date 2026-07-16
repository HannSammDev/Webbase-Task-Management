// src/Auth/AuthContext.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, db, functions } from "../Config/firebase";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [userData, setUserData] = useState(null); // data from Firestore

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch extra data from Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data()); // { name, email, ... }
        }
      } else {
        setUserData(null);
      }
      setUser(currentUser);
    });

    return unsubscribe; // cleanup on unmount
  }, []);

  const removeMember = async (uid) => {
    try {
      const deleteUserAccount = httpsCallable(functions, "deleteUserAccount");
      const result = await deleteUserAccount({ uid });
      console.log("Removed member:", result.data);
      return result.data;
    } catch (error) {
      console.error("removeMember failed:", error.code, error.message);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  const isAdmin = userData?.userRole === "admin";

  return (
    <AuthContext.Provider
      value={{ user, userData, isAdmin, removeMember, logout }}
    >
      {user === undefined ? null : children}
    </AuthContext.Provider>
  );
};

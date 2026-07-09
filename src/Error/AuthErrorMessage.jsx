import React from "react";

// Forgot Password
export const getResetErrorMessage = (err) => {
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
      return "No account found with that email address.";
    case "auth/network-request-failed":
      return "Check your internet connection";
    default:
      return err?.message || "Unable to send reset link. Please try again.";
  }
};

// Register or Add Employee
export const getErrorMessage = (err) => {
  switch (err?.code) {
    case "auth/email-already-in-use":
      return "An account already exists for that email.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is disabled in Firebase. Enable it in the Firebase Console.";
    case "auth/network-request-failed":
      return "Check your internet connection";
    default:
      return err?.message || "Unable to create your account. Please try again.";
  }
};

// Login Error
export const getErrorLogin = (err) => {
  switch (err.code) {
    case "auth/network-request-failed":
      return "Check your internet connection";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/invalid-credential":
      return "Invalid credentials. Please check your email and password.";
    default:
      return err.message || "Unable to Login";
  }
};

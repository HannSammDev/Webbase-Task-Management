import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContex";

export const ProtectedRoute = () => {
  const { user } = useAuth();

  if (user === undefined) return null; // still loading, render nothing
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />; // renders nested child routes
};

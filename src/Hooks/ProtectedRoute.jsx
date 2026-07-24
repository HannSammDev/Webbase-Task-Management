import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const ProtectedRoute = () => {
  const { user } = useAuth();

  if (user === undefined) return null; 
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />; // renders nested child routes
};

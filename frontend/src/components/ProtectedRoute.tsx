import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext";

/**
 * Wraps protected routes. Redirects to /login when the user has no valid token.
 * Replace the token check here if you later add token-expiry validation (e.g. jwt-decode).
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

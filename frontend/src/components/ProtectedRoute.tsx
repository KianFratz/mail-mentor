import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthProvider";
import { LoadingSpinner } from "./LoadingSpinner";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return showSpinner ? <LoadingSpinner /> : null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

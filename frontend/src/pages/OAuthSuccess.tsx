import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthProvider";

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      saveToken(token);
      navigate("/dashboard", { replace: true });
    } else {
      // No token found — send back to login
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, saveToken]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Signing you in...</p>
    </div>
  );
}

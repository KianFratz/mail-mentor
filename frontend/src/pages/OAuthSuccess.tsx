import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthProvider";
import api from "@/lib/axios";

interface RefreshResponse {
  access_token: string;
}

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { saveToken } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const completeOAuthLogin = async () => {
      try {
        const { data } = await api.post<RefreshResponse>("/auth/refresh");

        if (!data.access_token) {
          throw new Error("Missing access token");
        }

        if (!cancelled) {
          saveToken(data.access_token);
          navigate("/dashboard", { replace: true });
        }
      } catch {
        if (!cancelled) {
          navigate("/login", { replace: true });
        }
      }
    };

    void completeOAuthLogin();

    return () => {
      cancelled = true;
    };
  }, [navigate, saveToken]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Signing you in...</p>
    </div>
  );
}

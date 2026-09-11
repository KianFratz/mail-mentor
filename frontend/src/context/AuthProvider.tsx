import api from "@/lib/axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "@/lib/access-token";
import { isTokenExpired } from "@/lib/jwt";
import {
  emitTokenChange,
  onTokenChange,
  performLogout,
} from "@/lib/tokenEvents";
import type { AuthContextValue } from "@/types/auth.type";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface RefreshResponse {
  access_token: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getAccessToken());
  const [isInitializing, setIsInitializing] = useState(true);
  const initAttempted = useRef(false);

  useEffect(() => {
    const unsubscribe = onTokenChange((newToken) => {
      setToken(newToken);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (initAttempted.current) return;
    initAttempted.current = true;

    const initAuth = async () => {
      const existingToken = getAccessToken();

      // If we have a token and it's not expired, trust it — no need
      // to hit the network on every page load.
      if (existingToken && !isTokenExpired(existingToken)) {
        setIsInitializing(false);
        return;
      }

      // No memory token, OR it's expired: the httpOnly refresh cookie is
      // the durable source of truth, so attempt a refresh on page load.
      try {
        const { data } = await api.post<RefreshResponse>("/auth/refresh");
        setAccessToken(data.access_token);
        emitTokenChange(data.access_token);
      } catch {
        clearAccessToken();
        emitTokenChange(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  const saveToken = useCallback((newToken: string) => {
    setAccessToken(newToken);
    emitTokenChange(newToken);
    setIsInitializing(false);
  }, []);

  const logout = useCallback(() => {
    // Fire-and-forget from the caller's perspective; performLogout
    // handles the backend call, cleanup, and redirect internally.
    void performLogout();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isInitializing,
      saveToken,
      logout,
    }),
    [token, isInitializing, saveToken, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

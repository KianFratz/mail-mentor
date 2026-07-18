import api from "@/lib/axios";
import { isTokenExpired } from "@/lib/jwt";
import { onTokenChange } from "@/lib/tokenEvents";
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

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "access_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [isInitializing, setIsInitializing] = useState(true);
  const initAttempted = useRef(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

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
      const existingToken = localStorage.getItem(TOKEN_KEY);

      if (!existingToken) {
        setIsInitializing(false);
        return;
      }

      if (existingToken && !isTokenExpired(existingToken)) {
        setIsInitializing(false);
        return;
      }

      try {
        const { data } = await api.post("/auth/refresh");
        setToken(data.access_token);
      } catch {
        setToken(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  const saveToken = useCallback((newToken: string) => {
    setToken(newToken);
    setIsInitializing(false);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    setIsInitializing(false);
    window.location.replace("/login");
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

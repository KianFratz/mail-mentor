import api from "@/lib/axios";
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

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 <= Date.now() + 30_000;
  } catch {
    return true;
  }
}

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

    let cancelled = false;
    const initAuth = async () => {
      const existingToken = localStorage.getItem(TOKEN_KEY);

      if (existingToken && !isTokenExpired(existingToken)) {
        setIsInitializing(false);
        return;
      }

      try {
        const { data } = await api.post("/auth/refresh");
        if (!cancelled) {
          setToken(data.access_token);
        }
      } catch {
        if (!cancelled) {
          setToken(null);
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    };

    initAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const saveToken = useCallback((newToken: string) => {
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
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

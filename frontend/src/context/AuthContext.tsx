import { onTokenChange } from "@/lib/tokenEvents";
import type { AuthContextValue } from "@/types/auth.type";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext<AuthContextValue | null>(null);
const TOKEN_KEY = "access_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

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
    })
    return unsubscribe;
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
      saveToken,
      logout,
    }),
    [token, saveToken, logout],
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

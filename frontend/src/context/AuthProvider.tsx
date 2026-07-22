import { TOKEN_KEY } from "@/constants/auth.constant";
import api from "@/lib/axios";
import { isTokenExpired } from "@/lib/jwt";
import { onTokenChange, performLogout } from "@/lib/tokenEvents";
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
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );
  const [isInitializing, setIsInitializing] = useState(true);
  const initAttempted = useRef(false);

  // Token is now written to localStorage at the point of change
  // (saveToken / tokenEvents listener), not reactively here — avoids
  // a render-cycle gap between state and storage.
  useEffect(() => {
    const unsubscribe = onTokenChange((newToken) => {
      if (newToken) {
        localStorage.setItem(TOKEN_KEY, newToken);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
      setToken(newToken);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (initAttempted.current) return;
    initAttempted.current = true;

    const initAuth = async () => {
      const existingToken = localStorage.getItem(TOKEN_KEY);

      // If we have a token and it's not expired, trust it — no need
      // to hit the network on every page load.
      if (existingToken && !isTokenExpired(existingToken)) {
        setIsInitializing(false);
        return;
      }

      // No local token, OR it's expired: the httpOnly refresh cookie
      // is the real source of truth, so always attempt a refresh
      // rather than assuming "no local token" means "logged out."
      try {
        const { data } = await api.post<RefreshResponse>("/auth/refresh");
        localStorage.setItem(TOKEN_KEY, data.access_token);
        setToken(data.access_token);
      } catch (err) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  const saveToken = useCallback((newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
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

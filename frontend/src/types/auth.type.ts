export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  saveToken: (token: string) => void;
  logout: () => void;
}
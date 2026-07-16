export interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  saveToken: (token: string) => void;
  logout: () => void;
}
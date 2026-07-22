import { TOKEN_KEY } from "@/constants/auth.constant";
import api from "./axios";

type TokenListener = (token: string | null) => void;

const listeners = new Set<TokenListener>();

export function onTokenChange(listener: TokenListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function emitTokenChange(token: string | null) {
  return listeners.forEach((listener) => listener(token));
}

export async function performLogout() {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error(
      "Logout request failed, proceeding with client cleanup: ",
      err,
    );
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    window.location.replace("/login");
  }
}

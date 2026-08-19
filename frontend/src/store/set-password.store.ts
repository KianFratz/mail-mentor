import api from "@/lib/axios";
import { create } from "zustand";

interface SetPasswordStore {
  password: string;
  confirmPassword: string;
  error: string | null;
  success: boolean;
  loading: boolean;
  hasPassword: boolean | null;

  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setError: (error: string | null) => void;
  checkPasswordStatus: () => Promise<void>;
  submitSetPassword: () => Promise<boolean>;
  reset: () => void;
}

export const useSetPasswordStore = create<SetPasswordStore>((set, get) => ({
  password: "",
  confirmPassword: "",
  error: null,
  success: false,
  loading: false,
  hasPassword: null,

  setPassword: (password: string) => set({ password }),
  setConfirmPassword: (confirmPassword: string) => set({ confirmPassword }),
  setError: (error: string | null) => set({ error }),

  checkPasswordStatus: async () => {
    try {
      const response = await api.get("/auth/me");
      set({ hasPassword: response.data.hasPassword });
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  },

  submitSetPassword: async () => {
    const { password, confirmPassword } = get();
    set({ error: null, success: false });

    if (password.length < 6) {
      set({ error: "Password must be at least 6 characters long." });
      return false;
    }

    if (password !== confirmPassword) {
      set({ error: "Password do not match." });
      return false;
    }

    try {
      set({ loading: true });
      await api.post("/auth/set-password", {
        password: password,
      });

      set({
        success: true,
        password: "",
        confirmPassword: "",
        loading: false,
      });
      return true;
    } catch (err: any) {
      if (err.response?.status === 409) {
        set({
          error: "Your account already has a password set.",
          loading: false,
        });
      } else {
        set({
          error:
            err.response?.data?.message ||
            "Failed to set password. Please try again.",
          loading: false,
        });
      }
      return false;
    }
  },

  reset: () =>
    set({
      password: "",
      confirmPassword: "",
      error: null,
      success: false,
      loading: false,
    }),
}));
